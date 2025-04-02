import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { StockData } from "@/lib/stock-data";
import { getIndustryAverages } from "@/lib/industry-data";
import { 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Zap, 
  MessageCircle, 
  Calendar, 
  Lock,
  BarChart3,
  Layers
} from "lucide-react";
import { motion, useAnimation, useMotionValue, useTransform, PanInfo, AnimatePresence, useSpring } from "framer-motion";
import MetricPopup from "./metric-popup-fixed";
import PortfolioImpactCalculator from "./portfolio-impact-calculator";
import OverallAnalysisCard from "@/components/overall-analysis-card";
import { Skeleton } from "@/components/ui/skeleton";
import ComparativeAnalysis from "@/components/comparative-analysis";
import AskAI from "./ask-ai";
import PurchaseSuccessModal from "./purchase-success-modal";
import React from "react";

interface StockCardProps {
  stock: StockData;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCount: number;
  nextStock?: StockData;
  displayMode?: 'simple' | 'realtime';
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

// Add debounce utility at the top
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Add new memoized chart components
const MemoizedChart = React.memo(({ 
  chartData, 
  minValue, 
  maxValue, 
  realTimeChange 
}: { 
  chartData: number[], 
  minValue: number, 
  maxValue: number, 
  realTimeChange: number 
}) => {
  return (
    <svg
      viewBox={`0 0 ${chartData.length} 100`}
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop 
            offset="0%" 
            stopColor={realTimeChange >= 0 ? "rgb(34,197,94)" : "rgb(239,68,68)"} 
            stopOpacity="0.1"
          />
          <stop 
            offset="100%" 
            stopColor={realTimeChange >= 0 ? "rgb(34,197,94)" : "rgb(239,68,68)"} 
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      <path
        d={`M 0 ${100 - ((chartData[0] - minValue) / (maxValue - minValue)) * 100} 
           ${chartData.map((price, i) => 
             `L ${i} ${100 - ((price - minValue) / (maxValue - minValue)) * 100}`
           ).join(' ')}`}
        fill="none"
        stroke={realTimeChange >= 0 ? "rgb(34,197,94)" : "rgb(239,68,68)"}
        strokeWidth="2"
        className="transition-all duration-300"
      />

      <path
        d={`M 0 100 
           L 0 ${100 - ((chartData[0] - minValue) / (maxValue - minValue)) * 100} 
           ${chartData.map((price, i) => 
             `L ${i} ${100 - ((price - minValue) / (maxValue - minValue)) * 100}`
           ).join(' ')}
           L ${chartData.length - 1} 100 Z`}
        fill="url(#chartGradient)"
      />
    </svg>
  );
});

const MemoizedPriceIndicator = React.memo(({ 
  hoveredPrice, 
  hoveredIndex, 
  timeScaleLabels 
}: { 
  hoveredPrice: number | null, 
  hoveredIndex: number | null, 
  timeScaleLabels: string[] 
}) => {
  if (hoveredPrice === null || hoveredIndex === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute top-0 right-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-1.5 shadow-lg"
      style={{ zIndex: 20 }}
    >
      <div className="text-sm font-medium text-slate-900">
        ${hoveredPrice.toFixed(2)}
      </div>
      <div className="text-xs text-slate-500">
        {timeScaleLabels[hoveredIndex]}
      </div>
    </motion.div>
  );
});

// Add new memoized percentage change component
const MemoizedPercentageChange = React.memo(({ 
  change, 
  isRefreshing 
}: { 
  change: number, 
  isRefreshing: boolean 
}) => {
  return (
    <motion.div 
      className="ml-2 flex items-center"
      initial={false}
      animate={{ 
        opacity: isRefreshing ? 0.5 : 1,
        scale: isRefreshing ? 0.95 : 1
      }}
      transition={{ duration: 0.2 }}
    >
      <span className={`flex items-center text-sm font-semibold px-2 py-0.5 rounded-full 
        ${change >= 0 ? 'text-green-600 bg-green-50 border border-green-100' : 'text-red-600 bg-red-50 border border-red-100'}
        hover:shadow-md transition-shadow duration-200`}
      >
        {change >= 0 ? 
          <TrendingUp size={14} className="mr-1" /> : 
          <ChevronLeft size={14} className="mr-1 rotate-90" />}
        <motion.span
          key={change}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {change >= 0 ? '+' : ''}{change}%
        </motion.span>
      </span>
    </motion.div>
  );
});

// Update the chart section to prevent unnecessary rerenders
const MemoizedChartContainer = React.memo(({ 
  chartData,
  minValue,
  maxValue,
  realTimeChange,
  timeScaleLabels,
  onInteraction
}: { 
  chartData: number[],
  minValue: number,
  maxValue: number,
  realTimeChange: number,
  timeScaleLabels: string[],
  onInteraction: (price: number | null, index: number | null) => void
}) => {
  return (
    <div className="relative h-32 mt-4">
      <div className="relative h-full w-full">
        <MemoizedChart 
          chartData={chartData}
          minValue={minValue}
          maxValue={maxValue}
          realTimeChange={realTimeChange}
        />
        <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 pointer-events-none">
          <span>${maxValue.toFixed(2)}</span>
          <span>${((maxValue + minValue) / 2).toFixed(2)}</span>
          <span>${minValue.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
});

export default function StockCard({ 
  stock, 
  onNext, 
  onPrevious, 
  currentIndex, 
  totalCount,
  nextStock,
  displayMode = 'realtime'
}: StockCardProps) {
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

  // Unified modal state management to prevent iOS flickering issues
  const [modalState, setModalState] = useState<'closed' | 'calculator' | 'success'>('closed');
  const [purchaseData, setPurchaseData] = useState<{ 
    shares: number; 
    amount: number; 
    projectedReturn: number 
  } | null>(null);
  
  // Handle purchase completion - transition from calculator to success modal
  const handlePurchaseComplete = (data: { shares: number; amount: number; projectedReturn: number }) => {
    setPurchaseData(data);
    setModalState('success'); // Show success modal
  };

  // Handle success modal close - also move to next card after closing
  const handleSuccessModalClose = () => {
    setModalState('closed'); // Close the modal
    setPurchaseData(null);
    onNext(); // Trigger moving to the next card AFTER closing
  };

  // Memoize chart data to prevent unnecessary recalculations
  const chartData = useMemo(() => 
    generateTimeBasedData(stock.chartData, timeFrame),
    [stock.chartData, timeFrame, stock.ticker] // Only update when these actually change
  );

  // Format display price
  const displayPrice = stock.price.toFixed(2);
  const realTimeChange = stock.change;

  // Calculate min/max for chart display
  const minValue = Math.min(...chartData) - 5;
  const maxValue = Math.max(...chartData) + 5;

  // Get time scale labels based on selected timeframe
  const timeScaleLabels = useMemo(() => 
    getTimeScaleLabels(timeFrame),
    [timeFrame]
  );

  // Calculate price range for Y-axis
  const priceRangeMin = Math.floor(minValue);
  const priceRangeMax = Math.ceil(maxValue);

  // Get current date for the trading day
  const latestTradingDay = new Date().toISOString().split('T')[0];

  // Debounce the refresh function to prevent rapid updates
  const debouncedRefresh = useCallback(
    debounce(async () => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 1000);
    }, 2000), // 2 second debounce
    []
  );

  // Modify the refresh function to be more focused
  const refreshData = useCallback(() => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      // Only refresh for a shorter duration
      setTimeout(() => setIsRefreshing(false), 300);
    }
  }, [isRefreshing]);

  // Debounce the price hover updates
  const debouncedSetHoveredPrice = useCallback(
    debounce((price: number | null) => setHoveredPrice(price), 50),
    []
  );

  const debouncedSetHoveredIndex = useCallback(
    debounce((index: number | null) => setHoveredIndex(index), 50),
    []
  );

  // Add transition duration state to control animation speed
  const [transitionDuration, setTransitionDuration] = useState(300);

  // Modify the handleDragEnd function to be more stable
  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    setTransitionDuration(300); // Reset transition duration

    if (displayMode === 'realtime') {
      if (Math.abs(info.offset.x) < threshold) {
        // Not enough drag - Spring back smoothly
        cardControls.start({
          x: 0,
          opacity: 1,
          scale: 1,
          transition: { 
            type: "spring", 
            stiffness: 400, 
            damping: 40,
            duration: 0.4
          }
        });
        setSwipeDirection(null);
        return;
      }

      // Prevent multiple swipes while animation is in progress
      if (swipeDirection !== null) return;

      if (info.offset.x > threshold) {
        // Right swipe
        setSwipeDirection("right");
        if (navigator.vibrate) navigator.vibrate(50);
        
        cardControls.start({
          x: 0,
          opacity: 1,
          scale: 1,
          transition: { 
            type: "spring", 
            stiffness: 400, 
            damping: 40,
            duration: 0.4
          }
        }).then(() => {
          setTimeout(() => setModalState('calculator'), 150);
        });
      } else if (info.offset.x < -threshold) {
        // Left swipe
        setSwipeDirection("left");
        if (navigator.vibrate) navigator.vibrate(30);

        cardControls.start({
          x: -500,
          opacity: 0,
          transition: { duration: 0.3 }
        }).then(() => {
          onNext();
          // Reset card position with no animation
          setTransitionDuration(0);
          cardControls.set({ x: 0, opacity: 1 });
          setTimeout(() => {
            setSwipeDirection(null);
            setTransitionDuration(300);
          }, 50);
        });
      }
    } else {
      // Simple mode handling remains the same
      // ... existing simple mode code ...
    }
  }, [displayMode, swipeDirection, cardControls, onNext, onPrevious]);

  // Update the chart interaction handlers
  const handleChartInteraction = useCallback((price: number | null, index: number | null) => {
    debouncedSetHoveredPrice(price);
    debouncedSetHoveredIndex(index);
  }, [debouncedSetHoveredPrice, debouncedSetHoveredIndex]);

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
      const perfDetails = metricDetails as { 
        revenueGrowth: number; 
        profitMargin: number; 
        returnOnCapital: number;
        revenueGrowthExplanation?: string;
        profitMarginExplanation?: string;
        returnOnCapitalExplanation?: string;
      };
      metricValues.push(
        { 
          label: "Revenue Growth", 
          value: perfDetails.revenueGrowth, 
          suffix: "%",
          explanation: perfDetails.revenueGrowthExplanation || "How much the company's total sales have grown compared to last year."
        },
        { 
          label: "Profit Margin", 
          value: perfDetails.profitMargin, 
          suffix: "%",
          explanation: perfDetails.profitMarginExplanation || "The percentage of sales that become profit after all expenses."
        },
        { 
          label: "Return on Capital", 
          value: perfDetails.returnOnCapital, 
          suffix: "%",
          explanation: perfDetails.returnOnCapitalExplanation || "How efficiently the company uses its investments to generate profits."
        }
      );
    } else if (metricName === "Stability") {
      const stabDetails = metricDetails as { 
        volatility: number; 
        beta: number; 
        dividendConsistency: string;
        volatilityExplanation?: string;
        betaExplanation?: string;
        dividendConsistencyExplanation?: string;
      };
      metricValues.push(
        { 
          label: "Volatility", 
          value: stabDetails.volatility, 
          suffix: "",
          explanation: stabDetails.volatilityExplanation || "How dramatically the stock price fluctuates; lower means more stable."
        },
        { 
          label: "Beta", 
          value: stabDetails.beta, 
          suffix: "",
          explanation: stabDetails.betaExplanation || "How much the stock moves relative to the market. 1.0 means it moves with the market."
        },
        { 
          label: "Dividend Consistency", 
          value: stabDetails.dividendConsistency, 
          suffix: "",
          explanation: stabDetails.dividendConsistencyExplanation || "How reliably the company pays and increases its dividends over time."
        }
      );
    } else if (metricName === "Value") {
      const valDetails = metricDetails as { 
        peRatio: number; 
        pbRatio: number; 
        dividendYield: number | "N/A";
        peRatioExplanation?: string;
        pbRatioExplanation?: string;
        dividendYieldExplanation?: string;
      };
      metricValues.push(
        { 
          label: "P/E Ratio", 
          value: valDetails.peRatio, 
          suffix: "",
          explanation: valDetails.peRatioExplanation || "The price you pay for each dollar of company earnings."
        },
        { 
          label: "P/B Ratio", 
          value: valDetails.pbRatio, 
          suffix: "",
          explanation: valDetails.pbRatioExplanation || "The price compared to the company's accounting book value."
        },
        { 
          label: "Dividend Yield", 
          value: valDetails.dividendYield === "N/A" ? "N/A" : valDetails.dividendYield, 
          suffix: valDetails.dividendYield === "N/A" ? "" : "%",
          explanation: valDetails.dividendYieldExplanation || "The percentage return you receive annually from dividends."
        }
      );
    } else if (metricName === "Momentum") {
      const momDetails = metricDetails as { 
        threeMonthReturn: number; 
        relativePerformance: number; 
        rsi: number;
        threeMonthReturnExplanation?: string;
        relativePerformanceExplanation?: string;
        rsiExplanation?: string;
      };
      metricValues.push(
        { 
          label: "3-Month Return", 
          value: momDetails.threeMonthReturn, 
          suffix: "%",
          explanation: momDetails.threeMonthReturnExplanation || "How much the stock price has changed in the last three months."
        },
        { 
          label: "Relative Performance", 
          value: momDetails.relativePerformance, 
          suffix: "%",
          explanation: momDetails.relativePerformanceExplanation || "How the stock has performed compared to the overall market."
        },
        { 
          label: "RSI", 
          value: momDetails.rsi, 
          suffix: "",
          explanation: momDetails.rsiExplanation || "Technical indicator showing if a stock is potentially oversold or overbought."
        }
      );
    }

    // Get industry average data
    const industryAverage = displayMode === 'realtime' 
      ? getIndustryAverageData(stock, metricName.toLowerCase())
      : [];

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

  const openPortfolioCalculator = () => {
    setModalState('calculator');
  };

  // Inside the StockCard component, add new animations
  const priceSpring = useSpring(stock.price, {
    stiffness: 100,
    damping: 30,
    restSpeed: 0.001
  });

  // Enhanced price display animation
  useEffect(() => {
    priceSpring.set(stock.price);
  }, [stock.price]);

  // Add chart interaction enhancements
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Render appropriate stock card based on display mode
  if (displayMode === 'simple') {
    return (
      <div className="relative h-full w-full overflow-hidden">
        {/* Card stack container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Next card in stack (positioned behind) */}
          {nextStock && (
            <div 
              className="absolute inset-0 z-0 flex flex-col rounded-xl overflow-hidden"
              style={{
                transform: 'scale(0.92) translateY(20px)',
                opacity: 0.6,
                filter: 'blur(3px)'
              }}
            >
              {/* Very simple next card preview */}
              <div className="w-full h-full bg-gray-900 py-12 px-4 flex flex-col items-center justify-center">
                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/40 shadow-xl backdrop-blur-sm w-11/12 max-w-md flex flex-col items-center text-center space-y-4">
                  <h2 className="text-2xl font-bold text-white">{nextStock.name}</h2>
                  <p className="text-xl font-medium text-gray-300">{nextStock.ticker}</p>
                  <div className={`text-lg font-bold px-4 py-1 rounded-full ${nextStock.change >= 0 ? 'text-green-300 bg-green-900/30' : 'text-red-300 bg-red-900/30'}`}>
                    ${nextStock.price.toFixed(2)} <span>{nextStock.change >= 0 ? '↑' : '↓'} {Math.abs(nextStock.change)}%</span>
                  </div>

                  {/* Blurred content suggestion */}
                  <div className="w-3/4 h-2 bg-gray-700/50 rounded-full mt-2"></div>
                  <div className="w-2/3 h-2 bg-gray-700/50 rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          {/* Main stock card - enhanced with softer shadows and better rounded corners */}
          <motion.div
            className="absolute inset-0 z-10 bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-y-auto"
            ref={cardRef}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            animate={cardControls}
            whileDrag={{ scale: 0.98 }}
            style={{
              boxShadow: "0 20px 50px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
              borderRadius: "16px"
            }}
          >
            {/* Page indicator */}
            <div className="sticky top-2 left-0 right-0 z-20 flex justify-center">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs border border-gray-700">
                {currentIndex + 1} / {totalCount}
              </div>
            </div>

            {/* Enhanced Header with stock name and price */}
            <div className="p-5 border-b border-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{stock.name} <span className="text-gray-400">({stock.ticker})</span></h2>
                  
                  {/* Day's range information */}
                  <div className="flex items-center text-xs text-gray-400 mt-1 mb-2">
                    <span className="mr-2">Day's Range:</span>
                    <span className="font-medium">${(parseFloat(stock.price.toFixed(2)) * 0.98).toFixed(2)} - ${(parseFloat(stock.price.toFixed(2)) * 1.02).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className={`flex items-center py-1.5 px-4 rounded-full ${stock.change >= 0 ? 'bg-green-900/30 text-green-300 border border-green-700/30' : 'bg-red-900/30 text-red-300 border border-red-700/30'} shadow-lg`}>
                    <span className="font-bold text-2xl">${stock.price.toFixed(2)}</span>
                    <span className="ml-2 text-sm font-medium">{stock.change >= 0 ? '+' : ''}{stock.change}%</span>
                  </div>
                  
                  <span className="text-xs text-gray-500 mt-2">Updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                {stock.description}
              </p>
            </div>

            {/* Performance Metrics - Enhanced Card Style */}
            <div className="grid grid-cols-2 gap-5 p-5 border-b border-gray-800">
              <h3 className="text-white text-lg font-bold col-span-2 mb-1 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                Stock Metrics
              </h3>
              
              {Object.entries(stock.metrics).map(([key, metricObj]) => {
                const metricName = key.charAt(0).toUpperCase() + key.slice(1);

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.random() * 0.3 }}
                    key={key}
                    className={`p-4 rounded-xl relative ${
                      metricObj.color === 'green' ? 'bg-gradient-to-br from-green-900/40 to-black border border-green-500/30' :
                      metricObj.color === 'yellow' ? 'bg-gradient-to-br from-yellow-900/40 to-black border border-yellow-500/30' : 
                      'bg-gradient-to-br from-red-900/40 to-black border border-red-500/30'
                    } active:scale-98 transition-all duration-150 cursor-pointer shadow-lg hover:shadow-xl`}
                    onClick={() => handleMetricClick(metricName)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="absolute top-3 right-3 rounded-full bg-black/30 p-1">
                      <Info size={16} className={`${
                        metricObj.color === 'green' ? 'text-green-400' :
                        metricObj.color === 'yellow' ? 'text-yellow-400' : 
                        'text-red-400'
                      }`} />
                    </div>
                    
                    <div 
                      className={`text-2xl font-bold ${
                        metricObj.color === 'green' ? 'text-green-300' :
                        metricObj.color === 'yellow' ? 'text-yellow-300' : 
                        'text-red-300'
                      }`}
                    >
                      {metricObj.value}
                    </div>
                    
                    <div className="text-white text-sm font-medium capitalize mt-1 mb-3">
                      {metricName}
                    </div>
                    
                    {/* Subtle glow effect */}
                    <div className={`absolute bottom-1 left-1 w-12 h-12 rounded-full opacity-20 blur-xl -z-10 ${
                      metricObj.color === 'green' ? 'bg-green-400' :
                      metricObj.color === 'yellow' ? 'bg-yellow-400' : 
                      'bg-red-400'
                    }`} />
                  </motion.div>
                );
              })}
            </div>

            {/* Stock Synopsis with AI Integration */}
            <div className="p-5 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
                Ask AI About {stock.ticker}
              </h3>

              {/* Ask AI component integrated in dark mode with enhanced visuals */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-xl border border-gray-700/50 overflow-hidden shadow-lg relative"
              >
                {/* Subtle purple glow effect behind the component */}
                <div className="absolute -inset-1 bg-purple-500/5 blur-xl rounded-xl z-0"></div>
                <div className="relative z-10">
                  <AskAI stock={stock} />
                </div>
              </motion.div>
            </div>

            {/* Future predictions with enhanced premium styling */}
            <div className="p-5 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-amber-400" />
                Price Forecast 
                <span className="text-xs bg-gradient-to-r from-amber-800 to-amber-600 text-amber-100 px-3 py-1 rounded-full ml-2 shadow-inner shadow-amber-900/20 border border-amber-700/30">Premium</span>
              </h3>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    1-Year Return
                  </h4>
                  <div className="p-3 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-lg border border-gray-700/50 shadow-lg">
                    <span className="text-white text-lg font-bold">{stock.oneYearReturn || "N/A"}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Lock className="w-4 h-4 mr-1 text-amber-400" />
                    Predicted Price
                  </h4>
                  <div className="p-3 bg-gradient-to-br from-amber-900/20 to-gray-900/90 rounded-lg border border-amber-700/30 relative overflow-hidden shadow-lg">
                    <span className="text-white text-lg font-bold blur-sm select-none">{stock.predictedPrice || "$0.00"}</span>
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30">
                      <div className="flex items-center bg-amber-800/90 text-amber-100 px-3 py-1.5 rounded-lg border border-amber-600/50 shadow-md">
                        <Lock className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Unlock with Premium</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Full analysis with enhanced styling */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                Stock Analysis
              </h3>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <OverallAnalysisCard stock={stock} />
              </motion.div>

              {/* Industry Position & Comparative Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-4"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-indigo-400" />
                  Industry Comparison
                </h3>
                <ComparativeAnalysis currentStock={stock} />
              </motion.div>
              
              {/* Swipe call-to-action */}
              <div className="mt-8 mb-2 flex justify-center">
                <div className="text-gray-500 text-sm flex items-center">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span>Swipe to navigate</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Swipe indicators */}
        <div className="absolute top-1/2 left-4 z-20 transform -translate-y-1/2 opacity-50">
          <ChevronLeft size={40} className={`text-white/30 ${currentIndex === 0 ? 'invisible' : ''}`} />
        </div>
        <div className="absolute top-1/2 right-4 z-20 transform -translate-y-1/2 opacity-50">
          <ChevronRight size={40} className="text-white/30" />
        </div>

        {/* Metric Popup */}
        {isMetricPopupOpen && selectedMetric && (
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

  // Real-time display mode
  return (
    <div className="relative h-full" data-testid="stock-card">
      {/* Blurred background stock (next in stack) - visible during swipes */}
      <div 
        className="absolute inset-0 overflow-hidden blur-xl pointer-events-none opacity-20"
        style={{
          clipPath: x.get() > 0 ? 'inset(0 0 0 100%)' : 'inset(0 0 0 0)',
          opacity: Math.abs(x.get()) > 50 ? 0.2 : 0,
          transform: `translateX(${x.get() < 0 ? '60px' : '-60px'})`
        }}
      >
        {/* This would ideally be the next stock's preview, simplified here */}
        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-400/20 to-indigo-300/20"></div>
        </div>
      </div>
      {/* Skipped message - shows when swiping left */}
      {showSkippedMessage && (
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="text-xl font-semibold bg-red-800/90 text-white px-6 py-3 rounded-xl border border-red-500/40 shadow-xl">
            Stock Skipped
          </div>
        </motion.div>
      )}

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
        {/* Time Frame Selector - Enhanced with better visual contrast */}
        <div className="flex justify-center space-x-1 px-4 py-3 border-b border-slate-100 bg-white shadow-sm">
          {["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                timeFrame === period 
                  ? `${realTimeChange >= 0 ? 'text-green-600 bg-green-50 border border-green-200 shadow-sm' : 'text-red-600 bg-red-50 border border-red-200 shadow-sm'} font-medium` 
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
              onClick={() => setTimeFrame(period as TimeFrame)}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Stock Price and Chart - Enhanced with better visual hierarchy */}
        <div className="bg-white p-4 flex flex-col border-b border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-bold text-slate-900">{stock.name}</h2>
              <span className="text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded-md">{stock.ticker}</span>
            </div>
            <div className="flex items-center">
              <button 
                onClick={refreshData}
                className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                disabled={isRefreshing}
              >
                <RefreshCw size={17} className={`text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center">
            <span className="text-3xl font-bold text-slate-900 drop-shadow-sm tabular-nums">
              ${displayPrice}
            </span>
            <MemoizedPercentageChange 
              change={realTimeChange} 
              isRefreshing={isRefreshing}
            />
          </div>
          
          {/* Day's range information */}
          <div className="mt-1 flex items-center text-xs text-slate-500">
            <span className="mr-2">Day's Range:</span>
            <span className="font-medium">${(parseFloat(displayPrice) * 0.98).toFixed(2)} - ${(parseFloat(displayPrice) * 1.02).toFixed(2)}</span>
          </div>

          {/* Chart placeholder - visualize the data */}
          <MemoizedChartContainer 
            chartData={chartData}
            minValue={minValue}
            maxValue={maxValue}
            realTimeChange={realTimeChange}
            timeScaleLabels={timeScaleLabels}
            onInteraction={handleChartInteraction}
          />

          {/* Trading date and swipe instruction */}
          <div className="mt-4 flex items-center justify-between text-xs h-6">
            <span className="text-slate-900 font-medium">Last updated: {latestTradingDay}</span>
            <span className="text-slate-700 italic">Swipe <span className="text-red-600 font-medium">left to skip</span> • Swipe <span className="text-green-600 font-medium">right to invest</span></span>
          </div>
        </div>

        {/* Stock Metrics - Enhanced Card Style */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-white">
          {Object.entries(stock.metrics).map(([key, metricObj]) => {
            const metricName = key.charAt(0).toUpperCase() + key.slice(1);
            return (
              <motion.div
                key={key}
                className="group relative"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMetricClick(metricName)}
              >
                <div className={`p-4 rounded-xl border relative z-10 overflow-hidden cursor-pointer
                  shadow-md transition-all duration-300 ease-in-out
                  ${metricObj.color === 'green' ? 'hover:shadow-green-100' :
                  metricObj.color === 'yellow' ? 'hover:shadow-amber-100' : 
                  'hover:shadow-red-100'}`}
                >
                  {/* Enhanced hover effect with gradient */}
                  <motion.div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300
                      ${metricObj.color === 'green' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                      metricObj.color === 'yellow' ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 
                      'bg-gradient-to-br from-red-400 to-red-600'}`}
                  />
                  
                  {/* Metric indicator with icon */}
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center justify-center rounded-full w-8 h-8 
                      ${metricObj.color === 'green' ? 'bg-green-100 text-green-600' :
                       metricObj.color === 'yellow' ? 'bg-amber-100 text-amber-600' : 
                       'bg-red-100 text-red-600'}`}
                    >
                      {key === 'performance' && <TrendingUp size={16} />}
                      {key === 'stability' && <Shield size={16} />}
                      {key === 'value' && <DollarSign size={16} />}
                      {key === 'momentum' && <Zap size={16} />}
                    </div>
                    <Info size={15} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>

                  {/* Metric value and name */}
                  <div className={`text-lg font-semibold 
                    ${metricObj.color === 'green' ? 'text-slate-900' :
                     metricObj.color === 'yellow' ? 'text-slate-900' : 
                     'text-slate-900'}`}
                  >
                    {metricObj.value}
                  </div>
                  <div className="text-slate-500 text-sm font-medium mt-0.5 capitalize">{metricName}</div>
                </div>
              </motion.div>
            );
          })}
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
                    {realTimeChange >= 0 ? 'Bullish' : 'Bearish'}
                  </div>
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  {stock.synopsis.price}
                </p>
              </div>
            </div>
          </div>

          {/* Company Overview */}
          <div className="p-4 border-b border-slate-100 relative">
            <div className="flex items-center gap-4">
              <div className="text-white bg-gradient-to-br from-blue-400 to-indigo-600 w-12 h-12 min-w-12 flex items-center justify-center rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div className="flex-1 relative">
                <div className="font-bold text-slate-800 text-base flex items-center">
                  Company Overview
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  {stock.synopsis.company}
                </p>
              </div>
            </div>
          </div>

          {/* Portfolio Role */}
          <div className="p-4 relative">
            <div className="flex items-center gap-4">
              <div className="text-white bg-gradient-to-br from-violet-400 to-purple-600 w-12 h-12 min-w-12 flex items-center justify-center rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
              <div className="flex-1 relative">
                <div className="font-bold text-slate-800 text-base flex items-center">
                  Portfolio Role
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  {stock.synopsis.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparative Analysis Section - Modified for better touch interaction */}
        <div 
          className="bg-white border-t border-b border-slate-100 comparative-analysis-container"
          onClick={(e) => {
            // Only stop propagation if interacting with an interactive element
            if (e.target instanceof Element && 
                (e.target.closest('button') || e.target.closest('input') || 
                 e.target.closest('select') || e.target.closest('a'))) {
              e.stopPropagation();
            }
          }}
          // Remove touch handlers that interfere with mobile interactions
        >
          <ComparativeAnalysis currentStock={stock} />
        </div>
        
        {/* Ask AI Component has been removed */}

        {/* Bottom Swipe Instruction */}
        <div className="p-4 bg-white border-t border-b border-slate-100 mb-4">
          <motion.div 
            className="text-center text-sm font-medium text-slate-600 my-2"
            animate={{ 
              opacity: [1, 0.7, 1],
              y: [0, -2, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            Swipe <span className="text-red-600 font-medium">left to skip</span> • 
            Swipe <span className="text-green-600 font-medium">right to invest</span>
          </motion.div>
        </div>

        {/* Overall Analysis - Enhanced with consistent spacing */}
        {stock.overallAnalysis && (
          <div className="p-5 bg-gradient-to-b from-white to-slate-50">
            <div className="mb-1">
              <OverallAnalysisCard stock={stock} />
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

      {/* Hidden Buy Button - used for programmatic clicking */}
      <button 
        className="hidden"
        data-testid="buy-button"
        onClick={openPortfolioCalculator}
      >
        Buy
      </button>

      {/* Portfolio Impact Calculator - Unified state management */}
      {modalState === 'calculator' && (
        <PortfolioImpactCalculator
          isOpen={true} // Controlled by mounting/unmounting via modalState
          onClose={() => setModalState('closed')} // Directly close
          onPurchaseComplete={handlePurchaseComplete} // Pass completion handler
          stock={stock}
        />
      )}
      
      {/* Purchase Success Modal - Unified state management */}
      {modalState === 'success' && purchaseData && (
        <PurchaseSuccessModal
          isOpen={true} // Controlled by mounting/unmounting via modalState
          onClose={handleSuccessModalClose} // Use specific close handler
          stock={stock}
          shares={purchaseData.shares}
          amount={purchaseData.amount}
          projectedReturn={purchaseData.projectedReturn}
        />
      )}
    </div>
  );
}