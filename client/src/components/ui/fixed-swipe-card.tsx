import { useState, useEffect, useRef, useMemo } from "react";
import { StockData } from "@/lib/stock-data";
import { getIndustryAverages } from "@/lib/industry-data";
import { Star, Info, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useAnimation, useMotionValue, useTransform, PanInfo } from "framer-motion";
import MetricPopup from "./metric-popup-fixed";
import OverallAnalysisCard from "@/components/overall-analysis-card";

interface SwipeStockCardProps {
  stock: StockData;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCount: number;
  nextStock?: StockData; // Optional next stock to show during swipes
}

type TimeFrame = "1D" | "5D" | "1M" | "6M" | "YTD" | "1Y" | "5Y" | "MAX";

// Helper to generate new chart data based on the selected time frame
const generateTimeBasedData = (data: number[], timeFrame: TimeFrame) => {
  // Create variations of the chart data based on timeframe
  switch(timeFrame) {
    case "1D":
      return data.map(point => point * (0.99 + Math.random() * 0.03));
    case "5D":
      return data.map(point => point * (0.97 + Math.random() * 0.06));
    case "1M":
      return data.map((point, i) => point * (1 + (i/data.length) * 0.05 * (Math.random() > 0.5 ? 1 : -1)));
    case "6M":
      return data.map((point, i) => point * (1 + (i/data.length) * 0.10 * (Math.random() > 0.5 ? 1 : -1)));
    case "YTD":
      return data.map((point, i) => point * (1 + (i/data.length) * 0.15 * (Math.random() > 0.5 ? 1 : -1)));
    case "1Y":
      return data.map((point, i) => point * (1 + (i/data.length) * 0.20 * (Math.random() > 0.5 ? 1 : -1)));
    case "5Y":
      return data.map((point, i) => point * (1 + (i/data.length) * 0.40 * (Math.random() > 0.6 ? 1 : -1)));
    case "MAX":
      return data.map((point, i) => point * (1 + (i/data.length) * 0.60 * (Math.random() > 0.6 ? 1 : -1)));
    default:
      return data;
  }
};

// Helper to get appropriate time scale labels based on the selected timeframe
const getTimeScaleLabels = (timeFrame: TimeFrame): string[] => {
  switch(timeFrame) {
    case "1D":
      return ["9:30", "11:00", "12:30", "2:00", "3:30", "4:00"];
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
      return ["2019", "2020", "2021", "2022", "2023"];
    case "MAX":
      return ["2015", "2017", "2019", "2021", "2023"];
    default:
      return ["", "", "", "", ""];
  }
};

// Helper to get industry average data for a specific metric
const getIndustryAverageData = (stock: StockData, metricType: string) => {
  const industryData = getIndustryAverages(stock.industry);
  
  let industryAvg = [];
  
  switch(metricType) {
    case "performance":
      industryAvg.push(
        { label: "Revenue Growth", value: `${industryData.revenueGrowth}%` },
        { label: "Profit Margin", value: `${industryData.profitMargin}%` },
        { label: "Return on Capital", value: `${industryData.returnOnCapital}%` }
      );
      break;
    case "stability":
      industryAvg.push(
        { label: "Volatility", value: `${industryData.volatility}` },
        { label: "Beta", value: `${industryData.beta}` },
        { label: "Dividend Consistency", value: `${industryData.dividendConsistency}` }
      );
      break;
    case "value":
      industryAvg.push(
        { label: "P/E Ratio", value: `${industryData.peRatio}` },
        { label: "P/B Ratio", value: `${industryData.pbRatio}` },
        { label: "Dividend Yield", value: `${industryData.dividendYield}%` }
      );
      break;
    case "momentum":
      industryAvg.push(
        { label: "3-Month Return", value: `${industryData.threeMonthReturn}%` },
        { label: "Relative Performance", value: `${industryData.relativePerformance}%` },
        { label: "RSI", value: `${industryData.rsi}` }
      );
      break;
    default:
      break;
  }
  
  return industryAvg;
};

export default function FixedSwipeCard({ 
  stock, 
  onNext, 
  onPrevious, 
  currentIndex, 
  totalCount,
  nextStock
}: SwipeStockCardProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1M");
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // State for metric popup
  const [isMetricPopupOpen, setIsMetricPopupOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<{
    name: string;
    color: "green" | "yellow" | "red";
    data: any;
  } | null>(null);
  
  // Animation controls
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values
  const x = useMotionValue(0);
  const dragProgress = useTransform(
    x, 
    [-250, 0, 250], 
    [-1, 0, 1]
  );
  
  // Calculate transform values for the main card
  const cardRotation = useTransform(
    dragProgress,
    [-1, 0, 1],
    [-8, 0, 8]
  );
  
  const cardOpacity = useTransform(
    dragProgress,
    [-1, -0.8, 0, 0.8, 1],
    [0.3, 0.7, 1, 0.7, 0.3]
  );
  
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
  
  // Handle drag start, update, and end
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    setIsDragging(false);
    
    if (info.offset.x > threshold) {
      // Swiped right - previous card or invest
      setSwipeDirection("right");
      controls.start({
        x: window.innerWidth,
        transition: { duration: 0.3 }
      }).then(() => {
        onPrevious();
        controls.set({ x: 0 });
        setSwipeDirection(null);
      });
    } 
    else if (info.offset.x < -threshold) {
      // Swiped left - next card
      setSwipeDirection("left");
      controls.start({
        x: -window.innerWidth,
        transition: { duration: 0.3 }
      }).then(() => {
        onNext();
        controls.set({ x: 0 });
        setSwipeDirection(null);
      });
    } 
    else {
      // Return to center if not swiped far enough
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 500, damping: 50 }
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
      metricValues.push(
        { label: "Revenue Growth", value: stock.metrics.performance.details.revenueGrowth, suffix: "%" },
        { label: "Profit Margin", value: stock.metrics.performance.details.profitMargin, suffix: "%" },
        { label: "Return on Capital", value: stock.metrics.performance.details.returnOnCapital, suffix: "%" }
      );
    } else if (metricName === "Stability") {
      metricValues.push(
        { label: "Volatility", value: stock.metrics.stability.details.volatility, suffix: "" },
        { label: "Beta", value: stock.metrics.stability.details.beta, suffix: "" },
        { label: "Dividend Consistency", value: stock.metrics.stability.details.dividendConsistency, suffix: "" }
      );
    } else if (metricName === "Value") {
      const dividendYield = stock.metrics.value.details.dividendYield;
      metricValues.push(
        { label: "P/E Ratio", value: stock.metrics.value.details.peRatio, suffix: "" },
        { label: "P/B Ratio", value: stock.metrics.value.details.pbRatio, suffix: "" },
        { 
          label: "Dividend Yield", 
          value: dividendYield === "N/A" ? "N/A" : dividendYield, 
          suffix: dividendYield === "N/A" ? "" : "%" 
        }
      );
    } else if (metricName === "Momentum") {
      metricValues.push(
        { label: "3-Month Return", value: stock.metrics.momentum.details.threeMonthReturn, suffix: "%" },
        { label: "Relative Performance", value: stock.metrics.momentum.details.relativePerformance, suffix: "%" },
        { label: "RSI", value: stock.metrics.momentum.details.rsi, suffix: "" }
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
    <div className="relative h-full overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {/* Swipe direction indicator */}
      {swipeDirection && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div 
            className={`flex items-center justify-center w-24 h-24 rounded-full 
              ${swipeDirection === "left" ? "bg-cyan-800/20" : "bg-purple-800/20"} 
              ${swipeDirection === "left" ? "text-cyan-300" : "text-purple-300"}`
            }
          >
            <span className="text-xl font-semibold">
              {swipeDirection === "left" ? "Next" : "Invest"}
            </span>
          </div>
        </div>
      )}
      
      {/* Next stock preview - visible during swipe */}
      {nextStock && isDragging && (
        <div 
          className="absolute inset-0 z-0 flex items-center justify-center"
          style={{
            opacity: Math.abs(dragProgress.get()) * 0.7
          }}
        >
          <div 
            className="relative w-[90%] h-[85%] bg-gradient-to-br from-gray-800 to-black 
            rounded-xl shadow-xl border border-gray-700/30 overflow-hidden"
            style={{
              transform: `translateX(${dragProgress.get() < 0 ? 40 : -40}%) scale(0.9)`
            }}
          >
            {/* Header with stock name and price */}
            <div className="p-4 border-b border-gray-800 bg-black/50">
              <h2 className="text-lg font-bold text-white">
                {nextStock.name} <span className="text-gray-400">({nextStock.ticker})</span>
              </h2>
              <div className={`flex items-center mt-1 ${nextStock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <span className="text-lg font-semibold">${nextStock.price.toFixed(2)}</span>
                <span className="ml-2 text-sm">{nextStock.change >= 0 ? '+' : ''}{nextStock.change}%</span>
              </div>
            </div>
            
            {/* Simple chart preview */}
            <div className="h-32 p-4 bg-gradient-to-b from-black to-gray-900">
              <svg viewBox="0 0 100 40" width="100%" height="100%" preserveAspectRatio="none">
                <path
                  d={`M 0,20 ${nextStock.chartData.map((point, i) => {
                    const x = (i / (nextStock.chartData.length - 1)) * 100;
                    const y = 40 - ((point / Math.max(...nextStock.chartData)) * 30);
                    return `L ${x},${y}`;
                  }).join(" ")}`}
                  fill="none"
                  stroke={nextStock.change >= 0 ? "#10b981" : "#ef4444"}
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            
            {/* Metric pills */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around p-4 bg-black/60 backdrop-blur-sm">
              {Object.entries(nextStock.metrics).map(([key, metric]) => (
                <div 
                  key={key}
                  className={`px-3 py-1 rounded-full text-xs font-medium
                    ${metric.color === 'green' ? 'bg-green-900/50 text-green-300 border border-green-500/30' : 
                      metric.color === 'yellow' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30' : 
                      'bg-red-900/50 text-red-300 border border-red-500/30'}`
                  }
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Main card */}
      <motion.div 
        className="relative h-full overflow-y-auto overflow-x-hidden pb-16 z-10 rounded-xl bg-gradient-to-b from-gray-900 to-black shadow-2xl"
        ref={cardRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ 
          x,
          rotate: cardRotation,
          opacity: cardOpacity,
        }}
      >
        {/* Page indicator */}
        <div className="absolute top-2 left-0 right-0 flex justify-center z-10">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs border border-gray-700">
            {currentIndex + 1} / {totalCount}
          </div>
        </div>
        
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
          {/* Y-axis values */}
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
          {/* Header with name, ticker, and price side by side */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-bold text-white drop-shadow-sm">{stock.name} <span className="text-gray-400">({stock.ticker})</span></h2>
            </div>
            
            {/* Price bubble horizontal to the name */}
            <div className={`flex items-center ${stock.change >= 0 ? 'bg-gradient-to-r from-green-900/50 to-green-950/30' : 'bg-gradient-to-r from-red-900/50 to-red-950/30'} rounded-full px-3 py-1.5 border ${stock.change >= 0 ? 'border-green-500/30' : 'border-red-500/30'} shadow-lg`}
              style={{
                boxShadow: stock.change >= 0 ? '0 0 15px rgba(34, 197, 94, 0.1)' : '0 0 15px rgba(239, 68, 68, 0.1)'
              }}
            >
              <span className="text-xl font-bold text-white drop-shadow-md">${displayPrice}</span>
              <span className={`ml-2 text-sm ${stock.change >= 0 ? 'text-green-300' : 'text-red-300'} flex items-center font-medium drop-shadow-sm`}>
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${stock.change >= 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                {stock.change >= 0 ? '+' : ''}{stock.change}%
              </span>
            </div>
          </div>
          
          {/* Description bubble */}
          <div className="p-3 bg-gray-800/70 rounded-lg border border-gray-700/50 shadow-inner">
            <p className="text-sm text-gray-300">
              {stock.description}
            </p>
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

        {/* Stock Synopsis - Enhanced with unified appearance */}
        <div className="p-4 bg-gradient-to-br from-gray-900 via-gray-900 to-black border-b border-gray-800">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 shadow-lg mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-cyan-400 w-10 h-10 min-w-10 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-lg border border-cyan-800/30 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-lg text-white drop-shadow-sm">Stock Synopsis</h3>
            </div>
            <span className="text-xs text-cyan-300 bg-gray-800/50 px-2 py-1 rounded-full border border-gray-700/50 shadow-inner flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
              AI Analysis
            </span>
          </div>
          
          {/* Unified card with sections divided by borders */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
            {/* Price Trend */}
            <div className="border-b border-gray-700/70">
              <div className="flex gap-3 p-4">
                <div className={`text-${stock.change >= 0 ? 'green' : 'red'}-400 w-12 h-12 min-w-12 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-lg border border-${stock.change >= 0 ? 'green' : 'red'}-700/30`}
                  style={{
                    boxShadow: stock.change >= 0 ? '0 0 15px rgba(34, 197, 94, 0.1)' : '0 0 15px rgba(239, 68, 68, 0.1)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white text-base drop-shadow-sm flex items-center">
                    Price Trend
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${stock.change >= 0 ? 'text-green-300 bg-green-900/30 border border-green-700/30' : 'text-red-300 bg-red-900/30 border border-red-700/30'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 mt-1 leading-relaxed">{stock.synopsis.price}</div>
                </div>
              </div>
            </div>
            
            {/* Company News */}
            <div className="border-b border-gray-700/70">
              <div className="flex gap-3 p-4">
                <div className="text-blue-400 w-12 h-12 min-w-12 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-lg border border-blue-700/30"
                  style={{
                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.1)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg">
                    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                    <path d="M9 22v-4h6v4" />
                    <path d="M8 6h.01" />
                    <path d="M16 6h.01" />
                    <path d="M12 6h.01" />
                    <path d="M12 10h.01" />
                    <path d="M8 10h.01" />
                    <path d="M16 10h.01" />
                    <path d="M12 14h.01" />
                    <path d="M8 14h.01" />
                    <path d="M16 14h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white text-base drop-shadow-sm">Company Overview</div>
                  <div className="text-sm text-gray-300 mt-1 leading-relaxed">{stock.synopsis.company}</div>
                </div>
              </div>
            </div>
            
            {/* Portfolio Role */}
            <div>
              <div className="flex gap-3 p-4">
                <div className="text-purple-400 w-12 h-12 min-w-12 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-lg border border-purple-700/30"
                  style={{
                    boxShadow: '0 0 15px rgba(139, 92, 246, 0.1)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg">
                    <path d="M21 6H3" />
                    <path d="M10 12H3" />
                    <path d="M10 18H3" />
                    <circle cx="17" cy="15" r="3" />
                    <circle cx="17" cy="9" r="3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white text-base drop-shadow-sm">Portfolio Role</div>
                  <div className="text-sm text-gray-300 mt-1 leading-relaxed">{stock.synopsis.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Future price prediction (blurred as premium feature) */}
        <div className="p-4 bg-gradient-to-br from-gray-900 via-gray-900 to-black border-b border-gray-800">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <div className="text-amber-400 w-10 h-10 min-w-10 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-lg border border-amber-800/30 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m13 2-2 2.5L13 7" />
                    <path d="M19 10c-1-4-5-5-9-3" />
                    <path d="M3 2v10l3-3" />
                    <path d="M13 22v-5l-3 2-2-4 5-2V9" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-white drop-shadow-sm">Price Forecast</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-amber-700/80 to-amber-900/80 text-amber-200 text-xs px-2 py-1 rounded-full border border-amber-500/30">Premium</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-amber-400 w-8 h-8 min-w-8 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-lg border border-amber-800/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-300">1-Year Return</span>
                </div>
                <div className="backdrop-blur-sm bg-black/10 rounded-lg p-3 border border-gray-700">
                  <span className="text-white font-bold">{stock.oneYearReturn || "N/A"}</span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-amber-400 w-8 h-8 min-w-8 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-lg border border-amber-800/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 22v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7" />
                      <path d="M18 8V5a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v3" />
                      <path d="M12 12a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4Z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-300">Predicted Price</span>
                </div>
                <div className="backdrop-blur-[10px] bg-black/10 rounded-lg p-3 border border-gray-700 relative overflow-hidden">
                  <span className="text-white font-bold blur-sm select-none">{stock.predictedPrice || "$0.00"}</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-amber-500 text-sm font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Unlock Premium
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Full analysis section */}
        <div className="p-4 bg-gradient-to-br from-gray-900 via-gray-900 to-black">
          <OverallAnalysisCard 
            ticker={stock.ticker}
            name={stock.name}
            rating={stock.rating}
            analysis={stock.overallAnalysis}
          />
        </div>
      </motion.div>
      
      {/* Swipe indicators */}
      <div className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 opacity-50">
        <ChevronLeft size={40} className={`text-white/30 ${currentIndex === 0 ? 'invisible' : ''}`} />
      </div>
      <div className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 opacity-50">
        <ChevronRight size={40} className="text-white/30" />
      </div>
      
      {/* Metric Popup */}
      {isMetricPopupOpen && selectedMetric && (
        <MetricPopup
          isOpen={isMetricPopupOpen}
          onClose={() => setIsMetricPopupOpen(false)}
          metricName={selectedMetric.name}
          metricColor={selectedMetric.color}
          metricData={{
            ...selectedMetric.data,
            name: stock.name
          }}
        />
      )}
    </div>
  );
}