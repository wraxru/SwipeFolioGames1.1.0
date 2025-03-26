import { useState, useEffect, useRef, useMemo } from "react";
import { StockData } from "@/lib/stock-data";
import { getIndustryAverages } from "@/lib/industry-data";
import { Star, Info, AlertCircle, ChevronLeft, ChevronRight, RefreshCw, TrendingUp, DollarSign, Shield, Zap } from "lucide-react";
import { motion, useAnimation, useMotionValue, useTransform, PanInfo } from "framer-motion";
import MetricPopup from "./metric-popup-fixed";
import PortfolioImpactCalculator from "./portfolio-impact-calculator";
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
  // Smoother opacity transform for better visual experience
  const cardOpacity = useTransform(x, [-300, -100, 0, 100, 300], [0, 0.9, 1, 0.9, 0]);
  // Smoother rotation transform for more natural feel
  const cardRotate = useTransform(x, [-300, 0, 300], [-6, 0, 6]);
  // Scale effect for better tactile feel
  const cardScale = useTransform(x, [-300, -150, 0, 150, 300], [0.95, 0.97, 1, 0.97, 0.95]);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1D");
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSkippedMessage, setShowSkippedMessage] = useState(false);
  
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

  // State for portfolio impact calculator
  const [isPortfolioImpactOpen, setIsPortfolioImpactOpen] = useState(false);
  
  // Function to refresh data
  const refreshData = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchQuote(), refetchIntraday()]);
    setTimeout(() => setIsRefreshing(false), 1000); // Add a small delay for the animation
  };

  // Add a direct button for easier testing/accessibility
  const openPortfolioCalculator = () => {
    setIsPortfolioImpactOpen(true);
  };

  // Enhanced drag handler with smoother transitions and feedback
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    console.log("Drag offset:", info.offset.x); // Keep this for debugging

    // Left swipe - Show skipped message and go to next card
    if (info.offset.x < -threshold) {
      setSwipeDirection("left");
      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
      // Show skipped message
      setShowSkippedMessage(true);
      
      // Smoother exit animation
      cardControls.start({
        x: -500,
        opacity: 0,
        scale: 0.9,
        transition: { 
          type: "tween", 
          ease: "easeInOut",
          duration: 0.4 
        }
      }).then(() => {
        onNext();
        // Reset after animation
        setTimeout(() => {
          setShowSkippedMessage(false);
          cardControls.set({ x: 0, opacity: 1, scale: 1 });
          setSwipeDirection(null);
        }, 100);
      });
    }
    // Right swipe - Open portfolio impact calculator
    else if (info.offset.x > threshold) {
      setSwipeDirection("right");
      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      // Open portfolio calculator
      setIsPortfolioImpactOpen(true);
      // Spring back with smoother animation
      cardControls.start({
        x: 0,
        opacity: 1,
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 30,
          duration: 0.4
        }
      });
      setSwipeDirection(null);
    } 
    // Not enough drag - Spring back
    else {
      cardControls.start({
        x: 0,
        opacity: 1,
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          duration: 0.3
        }
      });
      setSwipeDirection(null);
    }

    // Left swipe - Show skipped message and go to next card
    if (info.offset.x < -threshold) {
      setSwipeDirection("left");
      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
      // Show skipped message
      setShowSkippedMessage(true);
      
      // Smoother exit animation
      cardControls.start({
        x: -500,
        opacity: 0,
        scale: 0.9,
        transition: { 
          type: "tween", 
          ease: "easeInOut",
          duration: 0.4 
        }
      }).then(() => {
        onNext();
        // Reset after animation
        setTimeout(() => {
          setShowSkippedMessage(false);
          cardControls.set({ x: 0, opacity: 1, scale: 1 });
          setSwipeDirection(null);
        }, 100);
      });
    }
    // Right swipe - Open portfolio impact calculator (only on right swipe)
      // Check if we need to swap the directions
      console.log("Drag offset:", info.offset.x); // Add this to debug

      // If the console shows positive values when dragging left, swap these conditions
      if (info.offset.x < -threshold) {
        // This is your RIGHT swipe logic now
        setSwipeDirection("right");
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        setIsPortfolioImpactOpen(true);
        // ...animation...
      }
      else if (info.offset.x > threshold) {
        // This becomes your LEFT swipe logic
        setSwipeDirection("left");
        // ...skipped message and animation...
      }
    // Not enough drag - Spring back
    else {
      cardControls.start({
        x: 0,
        opacity: 1,
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          duration: 0.3
        }
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
      {/* Blurred background stock (next in stack) - visible during swipes */}
      {onNext && (
        <div 
          className="absolute inset-0 overflow-hidden blur-xl pointer-events-none opacity-20"
          style={{
            clipPath: x.get() > 0 ? 'inset(0 0 0 100%)' : 'inset(0 0 0 0)',
            opacity: Math.abs(x.get()) > 50 ? 0.2 : 0,
            transform: `translateX(${x.get() < 0 ? '60px' : '-60px'})`,
          }}
        >
          {/* This would ideally be the next stock's preview, simplified here */}
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-400/20 to-indigo-300/20"></div>
          </div>
        </div>
      )}
      
      {/* Skipped message - shows when swiping left */}
      {showSkippedMessage && (
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="glass-effect px-6 py-3 rounded-xl bg-white/90 shadow-lg border border-slate-100 flex items-center">
            <div className="text-slate-700 font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Skipped!
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Swipe indicators - Enhanced */}
      <motion.div 
        className="swipe-indicator swipe-left"
        animate={{
          opacity: swipeDirection === "left" ? 0.9 : 0.5,
          scale: swipeDirection === "left" ? 1.1 : 1,
          x: swipeDirection === "left" ? -10 : 0
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <ChevronLeft size={28} className="mb-1" />
          <span className="text-[10px] font-medium">Next</span>
        </div>
      </motion.div>
      
      <motion.div 
        className="swipe-indicator swipe-right"
        animate={{
          opacity: swipeDirection === "right" ? 0.9 : 0.5,
          scale: swipeDirection === "right" ? 1.1 : 1,
          x: swipeDirection === "right" ? 10 : 0
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <DollarSign size={24} className="mb-1" />
          <span className="text-[10px] font-medium">Invest</span>
        </div>
      </motion.div>
      
      {/* Page indicator */}
      <div className="absolute top-2 left-0 right-0 flex justify-center z-10">
        <div className="glass-effect rounded-full px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
          {currentIndex + 1} / {totalCount}
        </div>
      </div>
      
      {/* Refresh and Portfolio buttons */}
      <div className="absolute top-2 right-4 z-10 flex space-x-2">
        <button 
          onClick={openPortfolioCalculator}
          className="glass-effect rounded-full p-2 text-xs shadow-sm hover:bg-white transition-all"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-blue-500"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </button>
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
        style={{ x, opacity: cardOpacity, rotateZ: cardRotate, scale: cardScale }}
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
                    
                    {/* Unique Icon for each metric type */}
                    <div className="absolute top-2 right-2">
                      {metricName === 'Performance' ? (
                        <TrendingUp size={16} className={`${
                          metricObj.color === 'green' ? 'text-green-500' :
                          metricObj.color === 'yellow' ? 'text-amber-500' : 
                          'text-red-500'
                        }`} />
                      ) : metricName === 'Value' ? (
                        <DollarSign size={16} className={`${
                          metricObj.color === 'green' ? 'text-green-500' :
                          metricObj.color === 'yellow' ? 'text-amber-500' : 
                          'text-red-500'
                        }`} />
                      ) : metricName === 'Stability' ? (
                        <Shield size={16} className={`${
                          metricObj.color === 'green' ? 'text-green-500' :
                          metricObj.color === 'yellow' ? 'text-amber-500' : 
                          'text-red-500'
                        }`} />
                      ) : (
                        <Zap size={16} className={`${
                          metricObj.color === 'green' ? 'text-green-500' :
                          metricObj.color === 'yellow' ? 'text-amber-500' : 
                          'text-red-500'
                        }`} />
                      )}
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
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-2 rounded-lg mr-3 shadow-md flex items-center justify-center w-10 h-10">
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

          {/* Unified cards with consistent styling */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden mb-4">
            {/* Common background with slight highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-xl opacity-30"></div>
            
            {/* Price Trend */}
            <div className="p-4 border-b border-slate-100 relative">
              <div className="flex items-center gap-4">
                <div className={`${realTimeChange >= 0 ? 'text-white bg-gradient-to-br from-green-400 to-green-600' : 'text-white bg-gradient-to-br from-red-400 to-red-600'} 
                  w-12 h-12 min-w-12 flex items-center justify-center rounded-lg shadow-md`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            
            {/* Company News */}
            <div className="p-4 border-b border-slate-100 relative">
              <div className="flex items-center gap-4">
                <div className="text-white bg-gradient-to-br from-blue-400 to-blue-600
                  w-12 h-12 min-w-12 flex items-center justify-center rounded-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            
            {/* Portfolio Role */}
            <div className="p-4 relative">
              <div className="flex items-center gap-4">
                <div className="text-white bg-gradient-to-br from-purple-400 to-purple-600
                  w-12 h-12 min-w-12 flex items-center justify-center rounded-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          
          {/* Premium Insights Section */}
          {(stock.oneYearReturn || stock.predictedPrice) && (
            <div className="mt-5 mb-1 px-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="text-yellow-600 w-8 h-8 min-w-8 flex items-center justify-center bg-gradient-to-r from-yellow-50 to-amber-100 rounded-md shadow-sm border border-yellow-200 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      <path d="m19 2 2 2-2 2"></path>
                      <path d="m19 20 2 2-2 2"></path>
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">Premium Insights</h3>
                </div>
                <div className="flex items-center text-xs bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                  </svg>
                  AI Predictions
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden mb-4">
                {/* Common background with slight highlight */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 to-yellow-50/20 rounded-xl opacity-30"></div>
                
                {/* 1-Year Return - Redesigned for prominence */}
                {stock.oneYearReturn && (
                  <div className="p-4 border-b border-slate-100 relative">
                    <div className="flex items-center gap-4">
                      <div className={`${parseFloat(stock.oneYearReturn) >= 0 ? 'text-white bg-gradient-to-br from-green-400 to-green-600' : 'text-white bg-gradient-to-br from-red-400 to-red-600'} 
                        w-12 h-12 min-w-12 flex items-center justify-center rounded-lg shadow-md`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {/* Calendar icon for 1-Year Return */}
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                          {parseFloat(stock.oneYearReturn) >= 0 ? 
                            <polyline points="12 14 12 18 16 18"></polyline> : 
                            <polyline points="12 18 12 14 8 14"></polyline>}
                        </svg>
                      </div>
                      <div className="flex-1 relative">
                        <div className="font-bold text-slate-800 text-base">
                          1-Year Return
                        </div>
                        <div className={`text-2xl font-bold mt-1 ${parseFloat(stock.oneYearReturn) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.oneYearReturn}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Predicted Price - Blurred as premium feature */}
                {stock.predictedPrice && (
                  <div className="p-4 relative">
                    <div className="flex items-center gap-4">
                      <div className="text-white bg-gradient-to-br from-blue-400 to-blue-600 
                        w-12 h-12 min-w-12 flex items-center justify-center rounded-lg shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {/* Crystal ball / prediction icon */}
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 8v4l3 3"/>
                          <path d="M7 19.4a6 6 0 0 1-2.4-8.4"/>
                          <path d="M17 19.4a6 6 0 0 0 2.4-8.4"/>
                        </svg>
                      </div>
                      <div className="flex-1 relative">
                        <div className="font-bold text-slate-800 text-base flex items-center">
                          Expected Price Target
                          <div className="ml-2 text-xs px-2 py-0.5 rounded-full text-amber-600 bg-amber-50 border border-amber-100">
                            PREMIUM
                          </div>
                        </div>
                        <div className="flex items-center mt-1.5">
                          <div className="text-lg font-bold text-slate-800 blur-sm hover:blur-none transition-all duration-300 bg-blue-50 rounded px-3 py-1">
                            {stock.predictedPrice}
                          </div>
                          <div className="ml-2 text-amber-600 text-xs flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 8v4"></path>
                              <path d="M12 16h.01"></path>
                            </svg>
                            Unlock with premium
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
      
      {/* Portfolio Impact Calculator */}
      <PortfolioImpactCalculator
        isOpen={isPortfolioImpactOpen}
        onClose={() => setIsPortfolioImpactOpen(false)}
        onInvest={() => {
          // Handle successful investment
          onNext(); // Move to next stock after investing
        }}
        stock={stock}
      />
    </div>
  );
}