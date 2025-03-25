import { useState, useEffect, useRef, useMemo } from "react";
import { StockData } from "@/lib/stock-data";
import { getIndustryAverages } from "@/lib/industry-data";
import { Star, Info, AlertCircle, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { motion, useAnimation, useMotionValue, useTransform, PanInfo } from "framer-motion";
import MetricPopup from "./metric-popup-fixed";
import OverallAnalysisCard from "@/components/overall-analysis-card";
import { useStockQuote, useIntradayData, useCompanyOverview } from "@/hooks/use-stock-data";
import { Skeleton } from "@/components/ui/skeleton";

interface RealTimeStockCardProps {
  stock: StockData;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCount: number;
}

type TimeFrame = "1D" | "5D" | "1M" | "6M" | "YTD" | "1Y" | "5Y" | "MAX";

// Helper to generate new chart data based on the selected time frame
const generateTimeBasedData = (data: number[], timeFrame: TimeFrame) => {
  // Create variations of the chart data based on timeframe
  switch(timeFrame) {
    case "1D":
      // 1-day data will be more volatile with hourly fluctuations
      return data.map((point, i) => point * (1 + Math.sin(i * 0.5) * 0.03));
    case "5D":
      // 5-day data will have bigger swings
      return data.map((point, i) => point * (1 + Math.sin(i * 0.3) * 0.05));
    case "1M":
      // Default monthly data
      return data;
    case "6M":
      // 6-month data will be smoother with an overall trend
      return data.map((point, i) => point * (1 + (i/data.length) * 0.1));
    case "1Y":
      // 1-year data with more pronounced trends
      return data.map((point, i) => point * (1 + Math.sin(i * 0.2) * 0.08 + (i/data.length) * 0.15));
    case "5Y":
      // 5-year data with longer cycles
      return data.map((point, i) => point * (1 + Math.sin(i * 0.1) * 0.12 + (i/data.length) * 0.3));
    case "MAX":
      // Lifetime data with very long cycles 
      return data.map((point, i) => point * (1 + Math.sin(i * 0.05) * 0.15 + (i/data.length) * 0.5));
    default:
      return data;
  }
};

// Function to get time scale labels based on timeframe
const getTimeScaleLabels = (timeFrame: TimeFrame): string[] => {
  switch(timeFrame) {
    case "1D":
      return ["9:30", "11:00", "12:30", "14:00", "15:30", "16:00"];
    case "5D":
      return ["Mon", "Tue", "Wed", "Thu", "Fri"];
    case "1M":
      return ["Week 1", "Week 2", "Week 3", "Week 4"];
    case "6M":
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    case "YTD":
      return ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
    case "1Y":
      return ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
    case "5Y":
      return ["2020", "2021", "2022", "2023", "2024"];
    case "MAX":
      return ["2015", "2017", "2019", "2021", "2023"];
    default:
      return ["9:30", "11:00", "12:30", "14:00", "15:30", "16:00"];
  }
};

// Function to get industry average metrics for the metric popup using our industry-data module
const getIndustryAverageData = (stock: StockData, metricType: string) => {
  // Get industry averages from our centralized data
  const industryAvgs = getIndustryAverages(stock.industry);
  
  // Format for display
  if (metricType === 'performance') {
    return [
      { label: "Revenue Growth", value: `${industryAvgs.performance.revenueGrowth}` },
      { label: "Profit Margin", value: `${industryAvgs.performance.profitMargin}` },
      { label: "Return on Capital", value: `${industryAvgs.performance.returnOnCapital}` }
    ];
  } else if (metricType === 'stability') {
    return [
      { label: "Volatility", value: `${industryAvgs.stability.volatility}` },
      { label: "Beta", value: `${industryAvgs.stability.beta}` },
      { label: "Dividend Consistency", value: `${industryAvgs.stability.dividendConsistency}` }
    ];
  } else if (metricType === 'value') {
    return [
      { label: "P/E Ratio", value: `${industryAvgs.value.peRatio}` },
      { label: "P/B Ratio", value: `${industryAvgs.value.pbRatio}` },
      { label: "Dividend Yield", value: `${industryAvgs.value.dividendYield}` }
    ];
  } else if (metricType === 'momentum') {
    return [
      { label: "3-Month Return", value: `${industryAvgs.momentum.threeMonthReturn}` },
      { label: "Relative Performance", value: `${industryAvgs.momentum.relativePerformance}` },
      { label: "RSI", value: `${industryAvgs.momentum.rsi}` }
    ];
  }
  
  // Default empty array if metric type is not recognized
  return [];
};

// Format the intraday data for chart display
const formatIntradayForChart = (data: any[] | undefined) => {
  if (!data || data.length === 0) return [];
  
  // Extract close prices and reverse to show oldest to newest
  return data.map(point => point.close).reverse();
};

export default function RealTimeStockCard({ 
  stock, 
  onNext, 
  onPrevious, 
  currentIndex, 
  totalCount 
}: RealTimeStockCardProps) {
  const cardControls = useAnimation();
  const x = useMotionValue(0);
  const cardOpacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const cardRotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1D");
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // State for metric popup
  const [isMetricPopupOpen, setIsMetricPopupOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<{
    name: string;
    color: "green" | "yellow" | "red";
    data: any;
  } | null>(null);
  
  // Fetch real-time stock data
  const { data: quoteData, isLoading: isLoadingQuote, refetch: refetchQuote } = useStockQuote(stock.ticker);
  const { data: intradayData, isLoading: isLoadingIntraday, refetch: refetchIntraday } = useIntradayData(stock.ticker);
  const { data: companyData, isLoading: isLoadingCompany } = useCompanyOverview(stock.ticker);
  
  // Format intraday data for chart
  const formattedIntradayData = useMemo(() => 
    formatIntradayForChart(intradayData),
    [intradayData]
  );
  
  // Choose chart data source - use real-time data if available, otherwise fallback to stock data
  const chartData = useMemo(() => {
    if (formattedIntradayData && formattedIntradayData.length > 0) {
      return formattedIntradayData;
    }
    return generateTimeBasedData(stock.chartData, timeFrame);
  }, [formattedIntradayData, stock.chartData, timeFrame]);
  
  // Parse real-time price and change percentage
  const realTimePrice = quoteData?.["05. price"] 
    ? parseFloat(quoteData["05. price"]) 
    : stock.price;
  
  // Convert change percentage string (e.g. "1.85%") to number
  const realTimeChange = quoteData?.["10. change percent"] 
    ? parseFloat(quoteData["10. change percent"].replace('%', '')) 
    : stock.change;
    
  // Format display price
  const displayPrice = realTimePrice.toFixed(2);
  
  // Calculate min/max for chart display
  const minValue = Math.min(...chartData) - 5;
  const maxValue = Math.max(...chartData) + 5;
  
  // Get time scale labels based on selected timeframe
  const timeScaleLabels = useMemo(() => 
    getTimeScaleLabels(timeFrame),
    [timeFrame]
  );

  // Function to refresh data
  const refreshData = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchQuote(), refetchIntraday()]);
    setTimeout(() => setIsRefreshing(false), 1000); // Add a small delay for the animation
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      setSwipeDirection("right");
      cardControls.start({
        x: 500,
        opacity: 0,
        transition: { duration: 0.3 }
      }).then(() => {
        onPrevious();
        cardControls.set({ x: 0, opacity: 1 });
        setSwipeDirection(null);
      });
    } else if (info.offset.x < -threshold) {
      setSwipeDirection("left");
      cardControls.start({
        x: -500,
        opacity: 0,
        transition: { duration: 0.3 }
      }).then(() => {
        onNext();
        cardControls.set({ x: 0, opacity: 1 });
        setSwipeDirection(null);
      });
    } else {
      cardControls.start({
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      });
      setSwipeDirection(null);
    }
  };

  // Handler for metric button clicks
  const handleMetricClick = (metricName: string) => {
    // Get color and data for the selected metric
    let color: "green" | "yellow" | "red" = "green";
    let metricObj;
    let metricDetails;
    
    switch(metricName) {
      case "Performance":
        metricObj = stock.metrics.performance;
        metricDetails = stock.metrics.performance.details;
        break;
      case "Stability":
        metricObj = stock.metrics.stability;
        metricDetails = stock.metrics.stability.details;
        break;
      case "Value":
        metricObj = stock.metrics.value;
        metricDetails = stock.metrics.value.details;
        break;
      case "Momentum":
        metricObj = stock.metrics.momentum;
        metricDetails = stock.metrics.momentum.details;
        break;
      default:
        return;
    }
    
    // Map color string to type
    if (metricObj.color === "green") color = "green";
    else if (metricObj.color === "yellow") color = "yellow";
    else if (metricObj.color === "red") color = "red";
    
    // Format metric values for display
    const metricValues = [];
    if (metricName === "Performance") {
      const perfDetails = metricDetails as { revenueGrowth: number; profitMargin: number; returnOnCapital: number };
      metricValues.push(
        { label: "Revenue Growth", value: perfDetails.revenueGrowth, suffix: "%" },
        { label: "Profit Margin", value: perfDetails.profitMargin, suffix: "%" },
        { label: "Return on Capital", value: perfDetails.returnOnCapital, suffix: "%" }
      );
    } else if (metricName === "Stability") {
      const stabDetails = metricDetails as { volatility: number; beta: number; dividendConsistency: string };
      metricValues.push(
        { label: "Volatility", value: stabDetails.volatility, suffix: "" },
        { label: "Beta", value: stabDetails.beta, suffix: "" },
        { label: "Dividend Consistency", value: stabDetails.dividendConsistency, suffix: "" }
      );
    } else if (metricName === "Value") {
      const valDetails = metricDetails as { peRatio: number; pbRatio: number; dividendYield: number | "N/A" };
      metricValues.push(
        { label: "P/E Ratio", value: valDetails.peRatio, suffix: "" },
        { label: "P/B Ratio", value: valDetails.pbRatio, suffix: "" },
        { label: "Dividend Yield", value: valDetails.dividendYield === "N/A" ? "N/A" : valDetails.dividendYield, suffix: valDetails.dividendYield === "N/A" ? "" : "%" }
      );
    } else if (metricName === "Momentum") {
      const momDetails = metricDetails as { threeMonthReturn: number; relativePerformance: number; rsi: number };
      metricValues.push(
        { label: "3-Month Return", value: momDetails.threeMonthReturn, suffix: "%" },
        { label: "Relative Performance", value: momDetails.relativePerformance, suffix: "%" },
        { label: "RSI", value: momDetails.rsi, suffix: "" }
      );
    }
    
    // Get industry average data
    const industryAverage = getIndustryAverageData(stock, metricName.toLowerCase());
    
    // Set selected metric data and open popup
    setSelectedMetric({
      name: metricName,
      color,
      data: {
        values: metricValues,
        rating: metricObj.value,
        industryAverage,
        industry: stock.industry,
        explanation: metricObj.explanation || "",
        name: stock.name
      }
    });
    
    setIsMetricPopupOpen(true);
  };

  // Price display format is defined above
  
  // Determine price range to show on Y-axis
  const priceRangeMin = Math.floor(minValue);
  const priceRangeMax = Math.ceil(maxValue);
  
  // Get latest trading day from API or fallback to current date
  const latestTradingDay = quoteData 
    ? quoteData["07. latest trading day"] 
    : new Date().toISOString().split('T')[0];
  
  return (
    <div className="relative h-full">
      {/* Swipe indicators */}
      <div className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 opacity-50">
        <ChevronLeft size={40} className={`text-slate-300 ${currentIndex === 0 ? 'invisible' : ''}`} />
      </div>
      <div className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 opacity-50">
        <ChevronRight size={40} className="text-slate-300" />
      </div>
      
      {/* Page indicator */}
      <div className="absolute top-2 left-0 right-0 flex justify-center z-10">
        <div className="glass-effect rounded-full px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
          {currentIndex + 1} / {totalCount}
        </div>
      </div>
      
      {/* Refresh button */}
      <div className="absolute top-2 right-4 z-10">
        <button 
          onClick={refreshData} 
          disabled={isRefreshing || isLoadingQuote || isLoadingIntraday}
          className="glass-effect rounded-full p-2 text-xs shadow-sm hover:bg-white transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={`text-sky-500 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <motion.div
        className="h-full overflow-y-auto overflow-x-hidden pb-16 stock-card"
        ref={cardRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        animate={cardControls}
        style={{ x, opacity: cardOpacity, rotateZ: cardRotate }}
      >
        {/* Time Frame Selector - Updated with Robinhood style */}
        <div className="flex justify-center space-x-1 px-4 py-3 border-b border-slate-100 bg-white">
          {["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                timeFrame === period 
                  ? `${realTimeChange >= 0 ? 'text-green-600 bg-green-50 border border-green-100' : 'text-red-600 bg-red-50 border border-red-100'} font-medium` 
                  : 'text-slate-500 hover:bg-slate-50 border border-transparent'
              }`}
              onClick={() => setTimeFrame(period as TimeFrame)}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Chart - updated to be thinner and sleeker */}
        <div className="px-4 pt-4 pb-6 border-b border-slate-100 h-48 relative bg-white">
          {isLoadingIntraday && timeFrame === "1D" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <RefreshCw size={20} className="animate-spin mx-auto text-sky-500 mb-2" />
                <p className="text-xs text-slate-400">Loading chart...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Y-axis values - minimalist styling */}
              <div className="absolute left-1 top-2 bottom-12 flex flex-col justify-between text-xs text-slate-400 w-8 text-right">
                <div className="px-1 font-medium">${priceRangeMax}</div>
                <div className="px-1 opacity-0">-</div>
                <div className="px-1 font-medium">${priceRangeMin}</div>
              </div>
              
              {/* Chart grid lines - very subtle */}
              <div className="absolute left-10 right-0 top-2 bottom-12 flex flex-col justify-between pointer-events-none">
                <div className="border-t border-slate-50 w-full h-0"></div>
                <div className="opacity-0 w-full h-0"></div>
                <div className="border-t border-slate-50 w-full h-0"></div>
              </div>
              
              <div className="ml-10 chart-container h-[calc(100%-20px)]">
                <svg viewBox="0 0 300 80" width="100%" height="100%" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`chartGradient-${stock.ticker}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={realTimeChange >= 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)"} />
                      <stop offset="100%" stopColor={realTimeChange >= 0 ? "rgba(34, 197, 94, 0)" : "rgba(239, 68, 68, 0)"} />
                    </linearGradient>
                    {/* Add a subtle glow effect */}
                    <filter id={`glow-${stock.ticker}`}>
                      <feGaussianBlur stdDeviation="0.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  {/* Line chart - thinner line for Robinhood style */}
                  {chartData.length > 0 && (
                    <>
                      <path
                        d={`M 0,${80 - ((chartData[0] - minValue) / (maxValue - minValue)) * 80} ${chartData.map((point, i) => {
                          const x = (i / (chartData.length - 1)) * 300;
                          const y = 80 - ((point - minValue) / (maxValue - minValue)) * 80;
                          return `L ${x},${y}`;
                        }).join(" ")}`}
                        fill="none"
                        stroke={realTimeChange >= 0 ? "#22c55e" : "#ef4444"}
                        strokeWidth="1.2" /* Thinner line */
                        filter={`url(#glow-${stock.ticker})`}
                      />
                      
                      {/* Area fill - very subtle gradient */}
                      <path
                        d={`M 0,${80 - ((chartData[0] - minValue) / (maxValue - minValue)) * 80} ${chartData.map((point, i) => {
                          const x = (i / (chartData.length - 1)) * 300;
                          const y = 80 - ((point - minValue) / (maxValue - minValue)) * 80;
                          return `L ${x},${y}`;
                        }).join(" ")} L 300,80 L 0,80 Z`}
                        fill={`url(#chartGradient-${stock.ticker})`}
                        opacity="0.1" /* More subtle */
                      />
                    </>
                  )}
                </svg>
              </div>
              
              {/* Removed time scale labels */}
            </>
          )}
        </div>

        {/* Stock Info */}
        <div className="px-4 py-4 border-b border-slate-100 bg-white">
          {/* Stock Name and Ticker */}
          <div className="mb-3">
            <h2 className="text-2xl font-bold text-slate-800">
              {stock.name} <span className="text-slate-500 text-lg">({stock.ticker})</span>
            </h2>
            
            {/* Price under stock name with change on the right */}
            <div className="flex justify-between items-center mt-2">
              {isLoadingQuote ? (
                <Skeleton className="h-8 w-32 bg-slate-100" />
              ) : (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-slate-800 mr-2">${displayPrice}</span>
                </div>
              )}
              
              {isLoadingQuote ? (
                <Skeleton className="h-6 w-16 bg-slate-100" />
              ) : (
                <div className={`text-sm px-3 py-1 rounded-full font-medium ${realTimeChange >= 0 ? 'text-green-600 bg-green-50 border border-green-100' : 'text-red-600 bg-red-50 border border-red-100'}`}>
                  <span className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${realTimeChange >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {realTimeChange >= 0 ? '+' : ''}{realTimeChange}%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Description bubble - Enhanced with depth and visual appeal */}
          <div className="mt-3 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-xl blur-md transform scale-[0.98] translate-y-1"></div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-lg relative overflow-hidden z-10">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-transparent rounded-full opacity-70"></div>
              <div className="flex items-start mb-2">
                <div className="bg-blue-100 text-blue-600 p-1.5 rounded-md mr-2 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm text-slate-800">Company Overview</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed relative z-10 pl-1">
                {companyData?.Description || stock.description}
              </p>
            </div>
          </div>
        </div>

        {/* Performance Metrics - Enhanced with depth and visual appeal */}
        <div className="p-5 bg-gradient-to-b from-white to-slate-50 border-b border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white p-1.5 rounded-lg mr-3 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 text-lg bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Performance Metrics</h3>
            </div>
            <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full shadow-sm">
              Tap for details
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(stock.metrics).map(([key, metricObj]) => {
              const metricName = key.charAt(0).toUpperCase() + key.slice(1);
              
              return (
                <div 
                  key={key}
                  className="relative group"
                >
                  {/* Shadow effect that appears on hover */}
                  <div className={`absolute inset-0 rounded-xl blur-sm transform scale-[0.98] translate-y-1 opacity-0 group-hover:opacity-100 transition-all duration-300
                    ${metricObj.color === 'green' ? 'bg-gradient-to-r from-green-100/30 to-emerald-100/30' :
                    metricObj.color === 'yellow' ? 'bg-gradient-to-r from-amber-100/30 to-yellow-100/30' : 
                    'bg-gradient-to-r from-red-100/30 to-rose-100/30'}`}>
                  </div>
                  
                  {/* Metric Card */}
                  <div 
                    className={`p-4 rounded-xl border relative z-10 overflow-hidden active:scale-95 transition-all duration-150 cursor-pointer shadow-md hover:shadow-lg group-hover:translate-y-[-2px]
                      ${metricObj.color === 'green' ? 'bg-white border-green-200 group-hover:border-green-300' :
                      metricObj.color === 'yellow' ? 'bg-white border-amber-200 group-hover:border-amber-300' : 
                      'bg-white border-red-200 group-hover:border-red-300'}`}
                    onClick={() => handleMetricClick(metricName)}
                  >
                    {/* Top gradient bar that appears on hover */}
                    <div className={`absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      ${metricObj.color === 'green' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      metricObj.color === 'yellow' ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : 
                      'bg-gradient-to-r from-red-400 to-rose-500'}`}>
                    </div>
                    
                    {/* Info Icon */}
                    <div className="absolute top-2 right-2">
                      <Info size={16} className={`${
                        metricObj.color === 'green' ? 'text-green-500' :
                        metricObj.color === 'yellow' ? 'text-amber-500' : 
                        'text-red-500'
                      }`} />
                    </div>
                    
                    {/* Decorative bubble in corner */}
                    <div className={`absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-20
                      ${metricObj.color === 'green' ? 'bg-gradient-to-br from-green-100 via-emerald-100 to-transparent' :
                      metricObj.color === 'yellow' ? 'bg-gradient-to-br from-amber-100 via-yellow-100 to-transparent' : 
                      'bg-gradient-to-br from-red-100 via-rose-100 to-transparent'}`}>
                    </div>
                    
                    {/* Metric Value and Name */}
                    <div 
                      className={`text-xl font-bold 
                        ${metricObj.color === 'green' ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent' :
                        metricObj.color === 'yellow' ? 'bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent' : 
                        'bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent'}`}
                    >
                      {metricObj.value}
                    </div>
                    <div className="text-slate-700 text-sm font-semibold capitalize mt-2">{metricName}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stock Synopsis - Enhanced with depth and visual appeal */}
        <div className="p-5 bg-gradient-to-b from-white to-slate-50 border-b border-slate-100">
          <div className="relative overflow-hidden mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/20 to-blue-100/20 transform scale-[0.99] translate-y-[2px] blur-md rounded-lg"></div>
            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 relative z-10 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-2 rounded-lg mr-3 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 text-lg bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Stock Synopsis</h3>
              </div>
              <div className="flex items-center text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 rounded-full shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
                AI Analysis
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Price - Enhanced with shadows and gradients */}
            <div className="relative group transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-green-100/30 to-emerald-100/30 rounded-xl blur-sm transform scale-[0.98] translate-y-1 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 relative z-10 overflow-hidden group-hover:border-green-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className={`${realTimeChange >= 0 ? 'text-white bg-gradient-to-br from-green-400 to-green-600' : 'text-white bg-gradient-to-br from-red-400 to-red-600'} 
                  w-12 h-12 min-w-12 flex items-center justify-center rounded-lg shadow-md`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="flex-1 relative">
                  <div className="font-bold text-slate-800 text-base flex items-center">
                    Price Trend
                    <div className={`ml-2 text-xs px-2 py-0.5 rounded-full ${realTimeChange >= 0 ? 'text-green-600 bg-green-50 border border-green-100' : 'text-red-600 bg-red-50 border border-red-100'}`}>
                      {realTimeChange >= 0 ? '+' : ''}{realTimeChange}%
                    </div>
                  </div>
                  <div className="text-sm text-slate-700 mt-1.5 leading-relaxed font-medium">{stock.synopsis.price}</div>
                </div>
              </div>
            </div>
            
            {/* Company - Enhanced with shadows and gradients */}
            <div className="relative group transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-indigo-100/30 rounded-xl blur-sm transform scale-[0.98] translate-y-1 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 relative z-10 overflow-hidden group-hover:border-blue-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="text-white bg-gradient-to-br from-blue-400 to-blue-600
                  w-12 h-12 min-w-12 flex items-center justify-center rounded-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                    <path d="M9 22v-4h6v4" />
                    <path d="M8 6h.01" />
                    <path d="M16 6h.01" />
                    <path d="M12 6h.01" />
                    <path d="M12 10h.01" />
                    <path d="M12 14h.01" />
                    <path d="M16 10h.01" />
                    <path d="M16 14h.01" />
                    <path d="M8 10h.01" />
                    <path d="M8 14h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-base">Company News</div>
                  <div className="text-sm text-slate-700 mt-1.5 leading-relaxed font-medium">{stock.synopsis.company}</div>
                </div>
              </div>
            </div>
            
            {/* Role - Enhanced with shadows and gradients */}
            <div className="relative group transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 to-violet-100/30 rounded-xl blur-sm transform scale-[0.98] translate-y-1 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 relative z-10 overflow-hidden group-hover:border-purple-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="text-white bg-gradient-to-br from-purple-400 to-purple-600
                  w-12 h-12 min-w-12 flex items-center justify-center rounded-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
                    <path d="M16.5 16 15 20h-6l-1.5-4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-base">Portfolio Role</div>
                  <div className="text-sm text-slate-700 mt-1.5 leading-relaxed font-medium">{stock.synopsis.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Analysis - Enhanced with consistent spacing */}
        {stock.overallAnalysis && (
          <div className="p-5 bg-gradient-to-b from-white to-slate-50">
            <div className="mb-1">
              <OverallAnalysisCard
                ticker={stock.ticker}
                name={stock.name}
                rating={stock.rating}
                analysis={stock.overallAnalysis}
              />
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Metric Popup */}
      {selectedMetric && (
        <MetricPopup
          isOpen={isMetricPopupOpen}
          onClose={() => setIsMetricPopupOpen(false)}
          metricName={selectedMetric.name}
          metricColor={selectedMetric.color}
          metricData={selectedMetric.data}
        />
      )}
    </div>
  );
}