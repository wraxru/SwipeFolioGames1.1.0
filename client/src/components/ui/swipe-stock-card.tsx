import { useState, useEffect, useRef } from "react";
import { StockData } from "@/lib/stock-data";
import { Star, Info, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useAnimation, useMotionValue, useTransform, PanInfo } from "framer-motion";

interface SwipeStockCardProps {
  stock: StockData;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCount: number;
}

export default function SwipeStockCard({ 
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
  
  const [timeFrame, setTimeFrame] = useState<string>("1M");
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);

  const chartData = stock.chartData;
  const minValue = Math.min(...chartData) - 2;
  const maxValue = Math.max(...chartData) + 2;

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
        <div className="bg-gray-800/70 rounded-full px-3 py-1 text-xs">
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
              className={`px-2 py-1 ${
                timeFrame === period 
                  ? "text-cyan-400 font-bold border-b-2 border-cyan-400" 
                  : "text-gray-400"
              }`}
              onClick={() => setTimeFrame(period)}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="px-2 pt-6 pb-2 border-b border-gray-800 h-44 relative">
          <svg viewBox="0 0 300 80" width="100%" height="100%" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
                <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
              </linearGradient>
              <linearGradient id="negativeChartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.3)" />
                <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
              </linearGradient>
            </defs>
            
            {/* Line chart */}
            <path
              d={`M 0,${80 - ((chartData[0] - minValue) / (maxValue - minValue)) * 80} ${chartData.map((point, i) => {
                const x = (i / (chartData.length - 1)) * 300;
                const y = 80 - ((point - minValue) / (maxValue - minValue)) * 80;
                return `L ${x},${y}`;
              }).join(" ")}`}
              fill="none"
              stroke={stock.change >= 0 ? "#06b6d4" : "#ef4444"}
              strokeWidth="2"
            />
            
            {/* Area fill */}
            <path
              d={`M 0,${80 - ((chartData[0] - minValue) / (maxValue - minValue)) * 80} ${chartData.map((point, i) => {
                const x = (i / (chartData.length - 1)) * 300;
                const y = 80 - ((point - minValue) / (maxValue - minValue)) * 80;
                return `L ${x},${y}`;
              }).join(" ")} L 300,80 L 0,80 Z`}
              fill={stock.change >= 0 ? "url(#chartGradient)" : "url(#negativeChartGradient)"}
            />
          </svg>
          
          {/* Time scale */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>6:00</span>
            <span>10:00</span>
            <span>14:00</span>
            <span>18:00</span>
            <span>22:00</span>
            <span>2:00</span>
          </div>
        </div>

        {/* Stock Info */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{stock.name} ({stock.ticker})</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-semibold">${stock.price.toFixed(2)}</span>
                <span className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ({stock.change >= 0 ? '+' : ''}{stock.change}%)
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={`${
                      star <= Math.floor(stock.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : star <= stock.rating
                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400 mt-1">SmartScore {stock.smartScore}</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {stock.description}
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-3 p-4 border-b border-gray-800">
          {Object.entries(stock.metrics).map(([key, { value, color }]) => (
            <div 
              key={key}
              className={`p-3 rounded-lg relative ${
                color === 'green' ? 'bg-green-900/30 border border-green-500/30' :
                color === 'yellow' ? 'bg-yellow-900/30 border border-yellow-500/30' : 
                'bg-red-900/30 border border-red-500/30'
              }`}
            >
              <div className="absolute top-2 right-2">
                <Info size={16} className="text-white/60" />
              </div>
              <div 
                className={`font-bold ${
                  color === 'green' ? 'text-green-500' :
                  color === 'yellow' ? 'text-yellow-500' : 
                  'text-red-500'
                }`}
              >
                {value}
              </div>
              <div className="text-white text-sm capitalize">{key}</div>
            </div>
          ))}
        </div>

        {/* Stock Synopsis */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-3 flex items-center">
            Stock Synopsis
            <span className="ml-2 text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
              AI-generated
            </span>
          </h3>
          <div className="space-y-4">
            {/* Price */}
            <div className="flex gap-3">
              <div className={`text-${stock.change >= 0 ? 'cyan' : 'red'}-400 p-2 bg-gray-800 rounded-full`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Price</div>
                <div className="text-sm text-gray-400">{stock.synopsis.price}</div>
              </div>
            </div>
            
            {/* Company */}
            <div className="flex gap-3">
              <div className="text-cyan-400 p-2 bg-gray-800 rounded-full">
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
              <div>
                <div className="font-semibold">Company</div>
                <div className="text-sm text-gray-400">{stock.synopsis.company}</div>
              </div>
            </div>
            
            {/* Role */}
            <div className="flex gap-3">
              <div className="text-cyan-400 p-2 bg-gray-800 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
                  <path d="M16.5 16 15 20h-6l-1.5-4" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Role</div>
                <div className="text-sm text-gray-400">{stock.synopsis.role}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}