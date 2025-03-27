import { useState, useRef } from "react";
import { StockData } from "@/lib/stock-data";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useAnimationControls, PanInfo } from "framer-motion";
import MetricPopup from "./metric-popup-fixed";
import OverallAnalysisCard from "@/components/overall-analysis-card";

interface SwipeStockCardProps {
  stock: StockData;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCount: number;
  nextStock?: StockData;
}

export default function SimpleStackCard({
  stock,
  onNext,
  onPrevious,
  currentIndex,
  totalCount,
  nextStock,
}: SwipeStockCardProps) {
  const [isMetricPopupOpen, setIsMetricPopupOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<{
    name: string;
    color: "green" | "yellow" | "red";
    data: any;
  } | null>(null);
  
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  // Handle card swipe
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Right swipe
      setSwipeDirection("right");
      controls.start({
        x: window.innerWidth,
        opacity: 0,
        transition: { duration: 0.3 }
      }).then(() => {
        onPrevious();
        controls.set({ x: 0, opacity: 1 });
        setSwipeDirection(null);
      });
    } else if (info.offset.x < -threshold) {
      // Left swipe
      setSwipeDirection("left");
      controls.start({
        x: -window.innerWidth,
        opacity: 0,
        transition: { duration: 0.3 }
      }).then(() => {
        onNext();
        controls.set({ x: 0, opacity: 1 });
        setSwipeDirection(null);
      });
    } else {
      // Return to center
      controls.start({
        x: 0,
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 }
      });
      setSwipeDirection(null);
    }
  };

  // Handle metric button click
  const handleMetricClick = (metricName: string) => {
    let color: "green" | "yellow" | "red" = "green";
    let metricObj;
    
    switch(metricName) {
      case "Performance":
        metricObj = stock.metrics.performance;
        break;
      case "Stability":
        metricObj = stock.metrics.stability;
        break;
      case "Value":
        metricObj = stock.metrics.value;
        break;
      case "Momentum":
        metricObj = stock.metrics.momentum;
        break;
      default:
        return;
    }
    
    if (metricObj.color === "green") color = "green";
    else if (metricObj.color === "yellow") color = "yellow";
    else if (metricObj.color === "red") color = "red";
    
    // Format values based on metric type
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
    
    setSelectedMetric({
      name: metricName,
      color,
      data: {
        values: metricValues,
        rating: metricObj.value,
        industryAverage: [],
        industry: stock.industry,
        explanation: metricObj.explanation || "",
        name: stock.name
      }
    });
    
    setIsMetricPopupOpen(true);
  };

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
        
        {/* Main stock card */}
        <motion.div
          className="absolute inset-0 z-10 bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-y-auto"
          ref={cardRef}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          animate={controls}
          whileDrag={{ scale: 0.98 }}
        >
          {/* Page indicator */}
          <div className="sticky top-2 left-0 right-0 z-20 flex justify-center">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs border border-gray-700">
              {currentIndex + 1} / {totalCount}
            </div>
          </div>
          
          {/* Header with stock name and price */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{stock.name} <span className="text-gray-400">({stock.ticker})</span></h2>
              <div className={`flex items-center py-1 px-3 rounded-full ${stock.change >= 0 ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                <span className="font-bold">${stock.price.toFixed(2)}</span>
                <span className="ml-2 text-sm">{stock.change >= 0 ? '+' : ''}{stock.change}%</span>
              </div>
            </div>
            
            <p className="mt-2 text-sm text-gray-300">
              {stock.description}
            </p>
          </div>
          
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-3 p-4 border-b border-gray-800">
            {Object.entries(stock.metrics).map(([key, metricObj]) => {
              const metricName = key.charAt(0).toUpperCase() + key.slice(1);
              
              return (
                <div 
                  key={key}
                  className={`p-3 rounded-xl relative ${
                    metricObj.color === 'green' ? 'bg-gradient-to-br from-green-900/40 to-black border border-green-500/30' :
                    metricObj.color === 'yellow' ? 'bg-gradient-to-br from-yellow-900/40 to-black border border-yellow-500/30' : 
                    'bg-gradient-to-br from-red-900/40 to-black border border-red-500/30'
                  } active:scale-95 transition-all duration-150 cursor-pointer shadow-lg hover:shadow-xl`}
                  onClick={() => handleMetricClick(metricName)}
                >
                  <div className="absolute top-2 right-2">
                    <Info size={16} className={`${
                      metricObj.color === 'green' ? 'text-green-400' :
                      metricObj.color === 'yellow' ? 'text-yellow-400' : 
                      'text-red-400'
                    }`} />
                  </div>
                  <div 
                    className={`text-lg font-bold ${
                      metricObj.color === 'green' ? 'text-green-300' :
                      metricObj.color === 'yellow' ? 'text-yellow-300' : 
                      'text-red-300'
                    }`}
                  >
                    {metricObj.value}
                  </div>
                  <div className="text-white text-sm font-medium capitalize mt-1">{metricName}</div>
                </div>
              );
            })}
          </div>

          {/* Stock Synopsis */}
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-bold text-white mb-3">Stock Synopsis</h3>
            
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="border-b border-gray-700/70">
                <div className="p-3">
                  <h4 className="font-bold text-white text-sm mb-1">Price Trend</h4>
                  <p className="text-sm text-gray-300">{stock.synopsis.price}</p>
                </div>
              </div>
              
              <div className="border-b border-gray-700/70">
                <div className="p-3">
                  <h4 className="font-bold text-white text-sm mb-1">Company Overview</h4>
                  <p className="text-sm text-gray-300">{stock.synopsis.company}</p>
                </div>
              </div>
              
              <div>
                <div className="p-3">
                  <h4 className="font-bold text-white text-sm mb-1">Portfolio Role</h4>
                  <p className="text-sm text-gray-300">{stock.synopsis.role}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Future predictions */}
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-bold text-white mb-3">Price Forecast <span className="text-xs bg-amber-900/70 text-amber-300 px-2 py-0.5 rounded-full ml-2">Premium</span></h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">1-Year Return</h4>
                <div className="p-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <span className="text-white font-bold">{stock.oneYearReturn || "N/A"}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Predicted Price</h4>
                <div className="p-2 bg-gray-800/50 rounded-lg border border-gray-700/50 relative overflow-hidden">
                  <span className="text-white font-bold blur-sm select-none">{stock.predictedPrice || "$0.00"}</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-amber-400 text-xs font-medium">Unlock Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Full analysis */}
          <div className="p-4">
            <OverallAnalysisCard 
              ticker={stock.ticker}
              name={stock.name}
              rating={stock.rating}
              analysis={stock.overallAnalysis}
            />
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