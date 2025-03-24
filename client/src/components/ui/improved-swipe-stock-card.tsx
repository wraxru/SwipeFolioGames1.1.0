import { useState, useEffect, useRef, useMemo } from "react";
import { StockData } from "@/lib/stock-data";
import { getIndustryAverages } from "@/lib/industry-data";
import { Star, Info, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useAnimation, useMotionValue, useTransform, PanInfo } from "framer-motion";
import MetricPopup from "./metric-popup";
import OverallAnalysisCard from "@/components/overall-analysis-card";

interface SwipeStockCardProps {
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
      { label: "Revenue Growth", value: `${industryAvgs.performance.revenueGrowth}% industry avg` },
      { label: "Profit Margin", value: `${industryAvgs.performance.profitMargin}% industry avg` },
      { label: "Return on Capital", value: `${industryAvgs.performance.returnOnCapital}% industry avg` }
    ];
  } else if (metricType === 'stability') {
    return [
      { label: "Volatility", value: `${industryAvgs.stability.volatility} industry avg` },
      { label: "Beta", value: `${industryAvgs.stability.beta} industry avg` },
      { label: "Dividend Consistency", value: `${industryAvgs.stability.dividendConsistency} industry avg` }
    ];
  } else if (metricType === 'value') {
    return [
      { label: "P/E Ratio", value: `${industryAvgs.value.peRatio} industry avg` },
      { label: "P/B Ratio", value: `${industryAvgs.value.pbRatio} industry avg` },
      { label: "Dividend Yield", value: `${industryAvgs.value.dividendYield}% industry avg` }
    ];
  } else if (metricType === 'momentum') {
    return [
      { label: "3-Month Return", value: `${industryAvgs.momentum.threeMonthReturn}% industry avg` },
      { label: "Relative Performance", value: `${industryAvgs.momentum.relativePerformance}% industry avg` },
      { label: "RSI", value: `${industryAvgs.momentum.rsi} industry avg` }
    ];
  }
  
  // Default empty array if metric type is not recognized
  return [];
};

export default function ImprovedSwipeStockCard({ 
  stock, 
  onNext, 
  onPrevious, 
  currentIndex, 
  totalCount 
}: SwipeStockCardProps) {
  const cardControls = useAnimation();
  const x = useMotionValue(0);
  const cardOpacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const cardRotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1M");
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  
  // State for metric popup
  const [isMetricPopupOpen, setIsMetricPopupOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<{
    name: string;
    color: "green" | "yellow" | "red";
    data: any;
  } | null>(null);
  
  // Use timeframe-dependent chart data
  const chartData = useMemo(() => 
    generateTimeBasedData(stock.chartData, timeFrame),
    [stock.chartData, timeFrame]
  );
  
  // Calculate min/max for chart display
  const minValue = Math.min(...chartData) - 5;
  const maxValue = Math.max(...chartData) + 5;
  
  // Get time scale labels based on selected timeframe
  const timeScaleLabels = useMemo(() => 
    getTimeScaleLabels(timeFrame),
    [timeFrame]
  );

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
        explanation: metricObj.explanation || ""
      }
    });
    
    setIsMetricPopupOpen(true);
  };

  // Convert price to display format
  const displayPrice = stock.price.toFixed(2);
  
  // Determine price range to show on Y-axis
  const priceRangeMin = Math.floor(minValue);
  const priceRangeMax = Math.ceil(maxValue);
  
  return (
    <div className="relative h-full">
      {/* Swipe indicators */}
      <div className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 opacity-50">
        <ChevronLeft size={40} className={`text-white/30 ${currentIndex === 0 ? 'invisible' : ''}`} />
      </div>
      <div className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 opacity-50">
        <ChevronRight size={40} className="text-white/30" />
      </div>
      
      {/* Page indicator */}
      <div className="absolute top-2 left-0 right-0 flex justify-center z-10">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs border border-gray-700">
          {currentIndex + 1} / {totalCount}
        </div>
      </div>

      <motion.div
        className="h-full overflow-y-auto overflow-x-hidden pb-16"
        ref={cardRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        animate={cardControls}
        style={{ x, opacity: cardOpacity, rotateZ: cardRotate }}
      >
        {/* Time Frame Selector */}
        <div className="flex justify-between px-4 py-2 border-b border-gray-800">
          {["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"].map((period) => (
            <button
              key={period}
              className={`px-2 py-1.5 rounded-md transition-all duration-200 ${
                timeFrame === period 
                  ? "text-cyan-400 font-bold border-b-2 border-cyan-400 bg-cyan-500/10" 
                  : "text-gray-400 hover:bg-gray-800"
              }`}
              onClick={() => setTimeFrame(period as TimeFrame)}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="px-4 pt-8 pb-8 border-b border-gray-800 h-60 relative mt-2 bg-gradient-to-b from-gray-900 to-black">
          {/* Y-axis values - fixed positioning to avoid sticking out */}
          <div className="absolute left-1 top-0 bottom-16 flex flex-col justify-between text-xs text-gray-500 w-8 text-right">
            <div className="w-full px-1 py-0.5 rounded bg-black/70 backdrop-blur-sm text-right">${priceRangeMax}</div>
            <div className="w-full px-1 py-0.5 rounded bg-black/70 backdrop-blur-sm text-right">${Math.round((priceRangeMax + priceRangeMin) / 2 * 100) / 100}</div>
            <div className="w-full px-1 py-0.5 rounded bg-black/70 backdrop-blur-sm text-right">${priceRangeMin}</div>
          </div>
          
          {/* Chart grid lines */}
          <div className="absolute left-10 right-0 top-0 bottom-16 flex flex-col justify-between pointer-events-none">
            <div className="border-t border-gray-800 w-full h-0"></div>
            <div className="border-t border-gray-800 w-full h-0"></div>
            <div className="border-t border-gray-800 w-full h-0"></div>
          </div>
          
          <div className="ml-10 chart-container h-[calc(100%-30px)]">
            <svg viewBox="0 0 300 80" width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`chartGradient-${stock.ticker}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={stock.change >= 0 ? "rgba(34, 197, 94, 0.4)" : "rgba(239, 68, 68, 0.4)"} />
                  <stop offset="100%" stopColor={stock.change >= 0 ? "rgba(34, 197, 94, 0)" : "rgba(239, 68, 68, 0)"} />
                </linearGradient>
                {/* Add a glow effect */}
                <filter id={`glow-${stock.ticker}`}>
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Line chart */}
              <path
                d={`M 0,${80 - ((chartData[0] - minValue) / (maxValue - minValue)) * 80} ${chartData.map((point, i) => {
                  const x = (i / (chartData.length - 1)) * 300;
                  const y = 80 - ((point - minValue) / (maxValue - minValue)) * 80;
                  return `L ${x},${y}`;
                }).join(" ")}`}
                fill="none"
                stroke={stock.change >= 0 ? "#22c55e" : "#ef4444"}
                strokeWidth="2.5"
                filter={`url(#glow-${stock.ticker})`}
              />
              
              {/* Area fill */}
              <path
                d={`M 0,${80 - ((chartData[0] - minValue) / (maxValue - minValue)) * 80} ${chartData.map((point, i) => {
                  const x = (i / (chartData.length - 1)) * 300;
                  const y = 80 - ((point - minValue) / (maxValue - minValue)) * 80;
                  return `L ${x},${y}`;
                }).join(" ")} L 300,80 L 0,80 Z`}
                fill={`url(#chartGradient-${stock.ticker})`}
              />
            </svg>
          </div>
          
          {/* Time scale */}
          <div className="ml-10 flex justify-between text-xs text-gray-400 mt-4 p-2 bg-black/40 backdrop-blur-sm rounded-md">
            {timeScaleLabels.map((label, index) => (
              <span key={index} className="font-medium">{label}</span>
            ))}
          </div>
        </div>

        {/* Stock Info */}
        <div className="px-4 py-4 border-b border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-black">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white drop-shadow-sm">{stock.name} <span className="text-gray-400">({stock.ticker})</span></h2>
              {/* Description moved up for better flow */}
              <div className="bg-gray-800/40 rounded-lg p-3 mt-2 border border-gray-700/50 shadow-inner">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {stock.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {/* Stars */}
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={`${
                      star <= Math.floor(stock.rating)
                        ? "text-yellow-400 fill-yellow-400 drop-shadow-md"
                        : star <= stock.rating
                        ? "text-yellow-400 fill-yellow-400 opacity-50 drop-shadow-sm"
                        : "text-gray-700"
                    }`}
                  />
                ))}
              </div>
              {/* SmartScore badge with just the value */}
              <span className="text-sm text-green-400 mt-1.5 bg-gray-800/70 px-3 py-1 rounded-full shadow-inner border border-gray-700/50 font-medium">
                {stock.smartScore}
              </span>
              
              {/* Price bubble moved to right column */}
              <div className="mt-3">
                <div className={`flex items-center ${stock.change >= 0 ? 'bg-gradient-to-r from-green-900/50 to-green-950/30' : 'bg-gradient-to-r from-red-900/50 to-red-950/30'} rounded-full px-3 py-2 border ${stock.change >= 0 ? 'border-green-500/30' : 'border-red-500/30'} shadow-lg`}
                  style={{
                    boxShadow: stock.change >= 0 ? '0 0 15px rgba(34, 197, 94, 0.1)' : '0 0 15px rgba(239, 68, 68, 0.1)'
                  }}
                >
                  <span className="text-2xl font-bold text-white drop-shadow-md">${displayPrice}</span>
                  <span className={`ml-2 text-sm ${stock.change >= 0 ? 'text-green-300' : 'text-red-300'} flex items-center font-medium drop-shadow-sm`}>
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${stock.change >= 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-3 p-4 border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-900/80">
          {Object.entries(stock.metrics).map(([key, metricObj]) => {
            const metricName = key.charAt(0).toUpperCase() + key.slice(1);
            
            return (
              <div 
                key={key}
                className={`p-3 rounded-xl relative ${
                  metricObj.color === 'green' ? 'bg-gradient-to-br from-green-900/40 to-black border border-green-500/50' :
                  metricObj.color === 'yellow' ? 'bg-gradient-to-br from-yellow-900/40 to-black border border-yellow-500/50' : 
                  'bg-gradient-to-br from-red-900/40 to-black border border-red-500/50'
                } active:scale-95 transition-all duration-150 cursor-pointer shadow-lg hover:shadow-xl backdrop-blur-sm`}
                onClick={() => handleMetricClick(metricName)}
                style={{
                  boxShadow: metricObj.color === 'green' ? '0 0 15px rgba(34, 197, 94, 0.15)' :
                          metricObj.color === 'yellow' ? '0 0 15px rgba(234, 179, 8, 0.15)' :
                          '0 0 15px rgba(239, 68, 68, 0.15)'
                }}
              >
                <div className="absolute top-2 right-2">
                  <Info size={16} className={`${
                    metricObj.color === 'green' ? 'text-green-400 drop-shadow-md' :
                    metricObj.color === 'yellow' ? 'text-yellow-400 drop-shadow-md' : 
                    'text-red-400 drop-shadow-md'
                  }`} />
                </div>
                <div 
                  className={`text-lg font-bold ${
                    metricObj.color === 'green' ? 'text-green-300' :
                    metricObj.color === 'yellow' ? 'text-yellow-300' : 
                    'text-red-300'
                  } drop-shadow-md`}
                >
                  {metricObj.value}
                </div>
                <div className="text-white text-sm font-medium capitalize mt-1 drop-shadow-sm">{metricName}</div>
              </div>
            );
          })}
        </div>

        {/* Stock Synopsis */}
        <div className="p-4 bg-gradient-to-br from-gray-900 via-gray-900 to-black border-b border-gray-800">
          <h3 className="font-bold text-lg mb-4 flex items-center text-white drop-shadow-sm">
            Stock Synopsis
            <span className="ml-2 text-xs text-green-300 bg-gray-800/50 px-2 py-1 rounded-full border border-gray-700/50 shadow-inner">
              AI-generated
            </span>
          </h3>
          <div className="space-y-4">
            {/* Price */}
            <div className="flex gap-3 bg-gradient-to-br from-gray-800/50 to-gray-900/70 p-4 rounded-xl border border-gray-700/50 hover:border-green-800/30 transition-all shadow-lg hover:shadow-green-900/5">
              <div className={`text-${stock.change >= 0 ? 'green' : 'red'}-400 w-12 h-12 min-w-12 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-full shadow-lg border border-${stock.change >= 0 ? 'green' : 'red'}-700/30`}
                style={{
                  boxShadow: stock.change >= 0 ? '0 0 15px rgba(34, 197, 94, 0.1)' : '0 0 15px rgba(239, 68, 68, 0.1)'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-base drop-shadow-sm">Price Trend</div>
                <div className="text-sm text-gray-300 mt-1 leading-relaxed">{stock.synopsis.price}</div>
              </div>
            </div>
            
            {/* Company */}
            <div className="flex gap-3 bg-gradient-to-br from-gray-800/50 to-gray-900/70 p-4 rounded-xl border border-gray-700/50 hover:border-green-800/30 transition-all shadow-lg hover:shadow-green-900/5">
              <div className="text-green-400 w-12 h-12 min-w-12 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-full shadow-lg border border-green-700/30"
                style={{
                  boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg">
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
                <div className="font-bold text-white text-base drop-shadow-sm">Company News</div>
                <div className="text-sm text-gray-300 mt-1 leading-relaxed">{stock.synopsis.company}</div>
              </div>
            </div>
            
            {/* Role */}
            <div className="flex gap-3 bg-gradient-to-br from-gray-800/50 to-gray-900/70 p-4 rounded-xl border border-gray-700/50 hover:border-green-800/30 transition-all shadow-lg hover:shadow-green-900/5">
              <div className="text-green-400 w-12 h-12 min-w-12 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-full shadow-lg border border-green-700/30"
                style={{
                  boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg">
                  <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
                  <path d="M16.5 16 15 20h-6l-1.5-4" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-base drop-shadow-sm">Portfolio Role</div>
                <div className="text-sm text-gray-300 mt-1 leading-relaxed">{stock.synopsis.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Analysis */}
        {stock.overallAnalysis && (
          <div className="p-4 bg-gray-900/80">
            <OverallAnalysisCard
              ticker={stock.ticker}
              name={stock.name}
              rating={stock.rating}
              analysis={stock.overallAnalysis}
            />
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