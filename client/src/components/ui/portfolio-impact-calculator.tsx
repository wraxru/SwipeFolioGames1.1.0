import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, DollarSign, ChevronDown, ChevronUp, Info, TrendingUp, Shield, Zap, ArrowRight, Check } from "lucide-react";
import { StockData } from "@/lib/stock-data";
import { usePortfolio } from "@/contexts/portfolio-context";
import { cn } from "@/lib/utils";

interface PortfolioImpactCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onInvest: () => void;
  stock: StockData;
}

export default function PortfolioImpactCalculator({
  isOpen,
  onClose,
  onInvest,
  stock,
}: PortfolioImpactCalculatorProps) {
  const { cash, calculateImpact, buyStock, isLoading } = usePortfolio();
  
  // State for investment amount - start with min $1
  const [investmentAmount, setInvestmentAmount] = useState<number>(1);
  const [showValueShares, setShowValueShares] = useState<boolean>(true); // true for value, false for shares
  
  // State for metric info tooltips
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  // Metric explanations
  const metricExplanations = {
    performance: "Shows how much your portfolio has grown over time through stock price increases and dividends.",
    stability: "Measures how consistent your portfolio's value remains during market ups and downs.",
    value: "Indicates whether the companies in your portfolio are reasonably priced compared to what they're actually worth.",
    momentum: "Shows the strength and direction of your portfolio's recent price movements."
  };
  
  // Slide-to-invest state variables
  const slideTrackRef = useRef<HTMLDivElement>(null);
  const [slideTrackWidth, setSlideTrackWidth] = useState(0);
  const [slidingInProgress, setSlidingInProgress] = useState(false);
  const [slideSuccess, setSlideSuccess] = useState(false);
  const slideX = useMotionValue(0);
  const successOpacity = useTransform(
    slideX,
    [0, slideTrackWidth * 0.7, slideTrackWidth],
    [0, 0.5, 1]
  );
  
  // Update track width on mount and when ref changes
  useEffect(() => {
    const updateTrackWidth = () => {
      if (slideTrackRef.current) {
        const thumbWidth = 80; // Approximate width of the slider thumb
        setSlideTrackWidth(slideTrackRef.current.clientWidth - thumbWidth);
      }
    };
    
    // Initial update
    updateTrackWidth();
    
    // Add resize listener to handle window size changes
    window.addEventListener('resize', updateTrackWidth);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateTrackWidth);
  }, [slideTrackRef, isOpen]);
  
  // Handle slide end
  const handleSlideEnd = () => {
    setSlidingInProgress(false);
    
    // If slid more than 70% of the way, trigger success (making it easier to complete)
    if (slideX.get() > slideTrackWidth * 0.7) {
      // Animate to completion
      slideX.set(slideTrackWidth);
      setSlideSuccess(true);
      
      // Haptic feedback if supported
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      
      // Delay before triggering actual invest action to allow animation to play
      setTimeout(() => {
        handleInvest();
      }, 600);
    } else {
      // Spring back to start with animation
      slideX.set(0);
    }
  };
  
  // Reset slide state when calculator is opened
  useEffect(() => {
    if (isOpen) {
      setSlideSuccess(false);
      setSlidingInProgress(false);
      slideX.set(0);
    }
  }, [isOpen, slideX]);
  
  // Calculate max investment (limited by cash)
  const maxInvestment = Math.min(cash, 100);
  
  // Calculate shares based on investment amount (minimum 0.001 shares)
  const shares = Math.max(investmentAmount / stock.price, 0.001);
  
  // Projected 1-year return (based on oneYearReturn if available)
  const oneYearReturnRate = typeof stock.oneYearReturn === 'number' 
    ? stock.oneYearReturn / 100 
    : typeof stock.oneYearReturn === 'string' 
      ? parseFloat(stock.oneYearReturn.replace("%", "")) / 100
      : 0.08; // Default 8% growth if no return data
      
  const projectedReturn = investmentAmount * oneYearReturnRate;
  const estimatedValue = investmentAmount + projectedReturn;
  
  // Calculate portfolio impact with validation
  const impact = calculateImpact(stock, investmentAmount);
  
  // Function to format metric change with colored arrow
  const formatMetricChange = (value: number) => {
    const formatted = value.toFixed(1);
    if (value > 0) {
      return <span className="text-green-500 flex items-center"><ChevronUp size={16} />{formatted}</span>;
    } else if (value < 0) {
      return <span className="text-red-500 flex items-center"><ChevronDown size={16} />{Math.abs(parseFloat(formatted))}</span>;
    } else {
      return <span className="text-gray-500">0</span>;
    }
  };
  
  // Function to get icon for metric
  const getMetricIcon = (metricName: string, size: number = 16) => {
    switch (metricName.toLowerCase()) {
      case "performance":
        return <TrendingUp size={size} />;
      case "value":
        return <DollarSign size={size} />;
      case "stability":
        return <Shield size={size} />;
      case "momentum":
        return <Zap size={size} />;
      default:
        return <Info size={size} />;
    }
  };
  
  // Handle investment amount changes
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setInvestmentAmount(Math.min(value, maxInvestment));
    }
  };
  
  // Handle increment/decrement buttons
  const incrementAmount = () => {
    setInvestmentAmount(prev => Math.min(prev + 1, maxInvestment));
  };
  
  const decrementAmount = () => {
    setInvestmentAmount(prev => Math.max(prev - 1, 1));
  };
  
  // Handle invest action
  const handleInvest = () => {
    buyStock(stock, investmentAmount);
    onInvest();
    onClose();
  };
  
  // Format number for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format percentage for display
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="calculator-overlay"
            onClick={onClose}
          />
          
          {/* Modal with enhanced animations and better centering */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { 
                type: "spring", 
                damping: 30, 
                stiffness: 350,
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1]
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              y: 20,
              transition: { duration: 0.25, ease: [0.32, 0, 0.67, 0] }
            }}
            className="calculator-modal"
            style={{
              boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.25), 0 12px 25px -10px rgba(0, 0, 0, 0.1)',
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '450px'
            }}
          >
            {/* Enhanced Modern Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-b from-white to-slate-50">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-2.5 rounded-xl mr-4 shadow-lg flex items-center justify-center w-12 h-12">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-0.5">
                    Portfolio Impact
                  </h2>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-green-600 mr-3">
                      {formatCurrency(cash)}
                    </span>
                    <span className="text-sm text-slate-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      {stock.name} ({stock.ticker})
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <div className="mb-4">
                {/* Title removed as it's redundant with the header */}
                
                {/* Pie Chart showing industry allocation */}
                <div className="relative h-48 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" width="200" height="200">
                      {/* Background circle - lighter when empty */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        stroke={Object.keys(impact.industryAllocation).length === 0 ? "#f3f4f6" : "#e5e7eb"} 
                        strokeWidth="20" 
                      />
                      
                      {/* Dynamic segments - only rendered when data exists */}
                      {Object.entries(impact.industryAllocation).length > 0 && 
                        Object.entries(impact.industryAllocation).map(([industry, allocation], index) => {
                          // Calculate segment parameters
                          const colors = ["#06b6d4", "#8b5cf6", "#fbbf24", "#34d399", "#f87171"];
                          const color = colors[index % colors.length];
                          const segmentPct = allocation.new;
                          const circumference = 2 * Math.PI * 40;
                          const previousSegments = Object.entries(impact.industryAllocation)
                            .slice(0, index)
                            .reduce((sum, [_, alloc]) => sum + alloc.new, 0);
                          const rotation = (previousSegments * 3.6) - 90; // -90 to start at top
                          
                          // Only render segments with actual percentage values
                          return segmentPct > 0 ? (
                            <circle 
                              key={industry}
                              cx="50" 
                              cy="50" 
                              r="40" 
                              fill="none" 
                              stroke={color} 
                              strokeWidth="20"
                              strokeDasharray={`${circumference * (segmentPct / 100)} ${circumference}`}
                              transform={`rotate(${rotation} 50 50)`}
                              strokeLinecap="butt"
                            />
                          ) : null;
                        })
                      }
                      
                      {/* Central circle */}
                      <circle cx="50" cy="50" r="30" fill="white" />
                      
                      {/* If no allocations, show empty state text */}
                      {Object.entries(impact.industryAllocation).length === 0 && (
                        <text 
                          x="50" 
                          y="53" 
                          textAnchor="middle" 
                          fontSize="8" 
                          fill="#6b7280"
                        >
                          First investment
                        </text>
                      )}
                    </svg>
                  </div>
                  
                  {/* Better positioned industry legends with improved styling */}
                  {Object.entries(impact.industryAllocation).length > 0 && (
                    <div className="absolute inset-0 pointer-events-none">
                      {Object.entries(impact.industryAllocation).map(([industry, allocation], index) => {
                        const colors = ["#06b6d4", "#8b5cf6", "#fbbf24", "#34d399", "#f87171"];
                        const color = colors[index % colors.length];
                        
                        // Calculate positions around the pie chart for better spacing
                        let positionStyle = {};
                        
                        if (industry === "Real Estate") {
                          positionStyle = {
                            top: '10%',
                            right: '75%',
                          };
                        } else if (industry === "Technology") {
                          positionStyle = {
                            top: '20%',
                            left: '65%',
                          };
                        } else if (industry === "Healthcare") {
                          positionStyle = {
                            bottom: '20%',
                            left: '65%',
                          };
                        } else if (industry === "Financial") {
                          positionStyle = {
                            bottom: '20%',
                            right: '65%',
                          };
                        } else {
                          // Position other industries in a clean layout
                          const positions = [
                            { top: '10%', left: '50%', transform: 'translateX(-50%)' },
                            { bottom: '10%', left: '50%', transform: 'translateX(-50%)' },
                            { left: '10%', top: '50%', transform: 'translateY(-50%)' },
                            { right: '10%', top: '50%', transform: 'translateY(-50%)' },
                          ];
                          
                          positionStyle = positions[index % positions.length];
                        }
                        
                        // Only show legend items with actual values
                        return allocation.new > 0 ? (
                          <div 
                            key={industry} 
                            className="absolute flex items-center px-2 py-1 rounded-lg shadow-md bg-white border border-slate-200"
                            style={{
                              ...positionStyle,
                              zIndex: 10,
                              maxWidth: '120px',
                              opacity: 0.95,
                            }}
                          >
                            <div className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: color }}></div>
                            <div className="flex flex-col items-start">
                              <div className="flex items-center">
                                <span className="mr-1 text-xs text-slate-700 font-medium truncate">{industry}</span>
                                <span className="font-bold text-xs text-slate-900">{formatPercentage(allocation.new)}</span>
                              </div>
                              {/* Only show change indicator when there's a difference */}
                              {allocation.new !== allocation.current && Math.abs(allocation.new - allocation.current) > 0.1 && (
                                <span className={cn(
                                  "text-[10px] font-medium",
                                  allocation.new > allocation.current ? "text-green-600" : "text-red-600"
                                )}>
                                  {allocation.new > allocation.current ? "+" : ""}
                                  {formatPercentage(allocation.new - allocation.current)}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                
                {/* Metric Comparisons - Modernized with equal sized buttons */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {Object.entries(impact.impact).map(([metric, change]) => (
                    <div 
                      key={metric} 
                      className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-sky-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`p-1.5 rounded-md mr-2 ${
                            change > 0 ? "bg-green-100 text-green-600" : 
                            change < 0 ? "bg-red-100 text-red-600" : 
                            "bg-slate-100 text-slate-600"
                          }`}>
                            {getMetricIcon(metric)}
                          </div>
                          <h4 className="font-semibold text-sm capitalize">{metric}</h4>
                          <button 
                            className="ml-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTooltip(activeTooltip === metric ? null : metric);
                            }}
                            aria-label={`Info about ${metric}`}
                          >
                            <Info size={14} />
                          </button>
                          {activeTooltip === metric && (
                            <div 
                              className="absolute z-50 bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-xs text-slate-700 max-w-[200px] mt-2 left-1/2 transform -translate-x-1/2"
                              style={{ top: '100%' }}
                            >
                              {(metricExplanations as any)[metric.toLowerCase()]}
                              <div className="absolute w-2 h-2 bg-white transform rotate-45 left-1/2 -mt-5 -ml-1 border-t border-l border-slate-200"></div>
                            </div>
                          )}
                        </div>
                        
                        <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          change > 0 ? "bg-green-100 text-green-700" : 
                          change < 0 ? "bg-red-100 text-red-700" : 
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {change > 0 ? "+" : ""}{change.toFixed(1)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {/* Current value */}
                        <div className="flex-1">
                          <div className="text-xs text-slate-500 mb-1 text-center">Current</div>
                          <div className="font-semibold text-center bg-slate-50 px-2 py-1.5 rounded-md shadow-sm border border-slate-100 w-full">
                            {impact.currentMetrics[metric as keyof typeof impact.currentMetrics].toFixed(1)}
                          </div>
                        </div>
                        
                        {/* Arrow indicator */}
                        <div className="text-slate-400 px-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                          </svg>
                        </div>
                        
                        {/* New value */}
                        <div className="flex-1">
                          <div className="text-xs text-slate-500 mb-1 text-center">New</div>
                          <div className={`font-semibold text-center px-2 py-1.5 rounded-md shadow-sm border w-full ${
                            change > 0 ? "bg-green-50 border-green-100" : 
                            change < 0 ? "bg-red-50 border-red-100" : 
                            "bg-slate-50 border-slate-100"
                          }`}>
                            {impact.newMetrics[metric as keyof typeof impact.newMetrics].toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Investment Amount Controls */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-md p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Investment Amount</h3>
                    <div className="flex items-center">
                      <button 
                        className={`px-3 py-1 text-xs rounded-l-lg border ${
                          showValueShares ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-slate-500 border-slate-200'
                        }`}
                        onClick={() => setShowValueShares(true)}
                      >
                        Value
                      </button>
                      <button 
                        className={`px-3 py-1 text-xs rounded-r-lg border ${
                          !showValueShares ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-slate-500 border-slate-200'
                        }`}
                        onClick={() => setShowValueShares(false)}
                      >
                        Shares
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full text-slate-700 hover:bg-slate-200 transition-colors"
                      onClick={decrementAmount}
                      disabled={investmentAmount <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                    </button>
                    
                    <div className="relative">
                      <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        className="block w-40 p-2 pl-8 text-center text-lg font-semibold border border-slate-200 rounded-lg"
                        value={investmentAmount}
                        onChange={handleAmountChange}
                        min={1}
                        max={maxInvestment}
                      />
                    </div>
                    
                    <button 
                      className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full text-slate-700 hover:bg-slate-200 transition-colors"
                      onClick={incrementAmount}
                      disabled={investmentAmount >= maxInvestment}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </button>
                  </div>
                  
                  <div className="text-center text-sm text-slate-600 mb-3">
                    {showValueShares ? (
                      <span>Approx. {shares.toFixed(4)} shares @ {formatCurrency(stock.price)}</span>
                    ) : (
                      <span>Value: {formatCurrency(shares * stock.price)}</span>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3 text-blue-800 text-sm flex items-center">
                    <Info size={16} className="mr-2 text-blue-500" />
                    Projected Return: {formatCurrency(projectedReturn)}
                  </div>
                </div>
                
                {/* Clickable Invest Button - Modern and clean alternative to slider */}
                <div className="mt-6">
                  {isLoading ? (
                    <motion.button 
                      disabled
                      className="w-full h-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-lg shadow-lg flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.02, 1],
                        opacity: [0.9, 1, 0.9]
                      }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 1.5
                      }}
                    >
                      <svg className="animate-spin mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleInvest}
                      className="w-full h-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-lg shadow-lg
                      flex items-center justify-center space-x-2 transition-all duration-300
                      hover:shadow-xl hover:from-green-400 hover:to-emerald-500 hover:scale-[1.02] active:scale-[0.98]"
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ 
                        boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4), 0 8px 10px -6px rgba(16, 185, 129, 0.2)"
                      }}
                    >
                      <span>Invest {formatCurrency(investmentAmount)}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </motion.button>
                  )}
                  
                  {/* Paper trading disclaimer */}
                  <div className="text-center text-xs text-slate-500 mt-3">
                    This is paper trading with virtual money.
                    <br />No real transactions will be processed.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}