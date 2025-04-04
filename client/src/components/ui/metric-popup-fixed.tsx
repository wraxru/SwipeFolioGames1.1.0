import React from "react";
import { X, Info, TrendingUp, ArrowRight, PlusCircle, CircleDot, ChevronUp, ChevronDown, Minus, HelpCircle, DollarSign, Shield, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Utility functions for comparison
// Get comparison status (better, similar, worse)
function getComparisonStatus(value: number | string, industry: number | string, 
                          isLowerBetter: boolean = false): "green" | "yellow" | "red" {
  // Handle non-numeric qualitative values
  if (typeof value === 'string' && (value === 'High' || value === 'Medium' || value === 'Low')) {
    if (value === industry) return "yellow";
    if (value === 'High' && industry === 'Medium') return "green";
    if (value === 'Low' && industry === 'Medium') return "red";
    if (value === 'Medium' && industry === 'Low') return "green";
    if (value === 'Medium' && industry === 'High') return "red";
    return "yellow";
  }

  // Parse numeric values
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const numIndustry = typeof industry === 'string' ? parseFloat(industry) : industry;
  
  // If we couldn't parse numbers, return neutral
  if (isNaN(numValue) || isNaN(numIndustry)) {
    console.log("Could not parse values for comparison:", value, industry);
    return "yellow"; // Default to neutral
  }
  
  // Handle numeric values
  if (isLowerBetter) {
    // For metrics where lower is better (like volatility, PE ratio)
    if (numValue < numIndustry * 0.9) return "green";
    if (numValue > numIndustry * 1.1) return "red";
    return "yellow";
  } else {
    // For metrics where higher is better (like revenue growth)
    if (numValue > numIndustry * 1.1) return "green";
    if (numValue < numIndustry * 0.9) return "red";
    return "yellow";
  }
}

// Get comparison symbol
function getComparisonSymbol(value: number | string, industry: number | string, 
                        isLowerBetter: boolean = false): "<" | "=" | ">" {
  // Parse string values to numbers if possible
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const numIndustry = typeof industry === 'string' ? parseFloat(industry) : industry;
  
  // If we couldn't parse numbers, return equals
  if (isNaN(numValue) || isNaN(numIndustry)) {
    console.log("Could not parse values for symbol:", value, industry);
    return "="; // Default for non-numeric comparisons
  }
  
  // Handle numeric values with 5% threshold for equality
  const ratio = numValue / numIndustry;
  
  if (isLowerBetter) {
    // For metrics where lower is better
    if (ratio < 0.95) return "<"; // Value is less than industry (good)
    if (ratio > 1.05) return ">"; // Value is greater than industry (bad)
    return "="; // Approximately equal
  } else {
    // For metrics where higher is better
    if (ratio > 1.05) return ">"; // Value is greater than industry (good)
    if (ratio < 0.95) return "<"; // Value is less than industry (bad)
    return "="; // Approximately equal
  }
}

interface MetricPopupProps {
  isOpen: boolean;
  onClose: () => void;
  metricName: string;
  metricColor: "green" | "yellow" | "red";
  metricData: {
    values: {
      label: string;
      value: string | number;
      suffix?: string;
      industry?: string | number; // For industry average comparison
      explanation?: string; // Explanation for this specific metric
    }[];
    rating: "High" | "Strong" | "Fair" | "Low" | "Unstable" | "Weak" | "Good" | "Average" | "Poor";
    industryAverage: {
      label: string;
      value: string;
    }[];
    industry: string;
    explanation?: string;
    name?: string; // Company name
  };
}

const getColorClass = (color: "green" | "yellow" | "red") => {
  switch (color) {
    case "green":
      return "text-green-600";
    case "yellow":
      return "text-amber-600";
    case "red":
      return "text-red-600";
    default:
      return "text-slate-800";
  }
};

const getBgColorClass = (color: "green" | "yellow" | "red") => {
  switch (color) {
    case "green":
      return "bg-green-50/90";
    case "yellow":
      return "bg-amber-50/90";
    case "red":
      return "bg-red-50/90";
    default:
      return "bg-slate-50";
  }
};

const getBorderColorClass = (color: "green" | "yellow" | "red") => {
  switch (color) {
    case "green":
      return "border-green-200";
    case "yellow":
      return "border-amber-200";
    case "red":
      return "border-red-200";
    default:
      return "border-slate-200";
  }
};

// Function to determine if a metric is better when lower (like P/E ratio, volatility)
const isMetricBetterWhenLower = (metricLabel: string): boolean => {
  const lowerIsBetterMetrics = [
    "P/E Ratio", 
    "P/B Ratio", 
    "Volatility", 
    "Beta"
  ];
  return lowerIsBetterMetrics.some(metric => 
    metricLabel.toLowerCase().includes(metric.toLowerCase())
  );
};

// Component to display comparison symbol
const ComparisonSymbol = ({ 
  symbol,
  color
}: { 
  symbol: "<" | "=" | ">" | "~", 
  color: "green" | "yellow" | "red" 
}) => {
  const textColorClass = getColorClass(color);
  
  return (
    <div className={`flex items-center justify-center ${textColorClass} font-bold text-lg mx-1`}>
      {symbol === ">" && <ChevronUp size={18} className={textColorClass} />}
      {symbol === "=" && <Minus size={18} className={textColorClass} />}
      {symbol === "~" && <span className={textColorClass}>~</span>}
      {symbol === "<" && <ChevronDown size={18} className={textColorClass} />}
    </div>
  );
};

// Get the metric description based on the label
const getMetricDescription = (metricLabel: string): string => {
  switch (metricLabel) {
    case "P/E Ratio":
      return "How many dollars you pay for each dollar the company earns per year; a higher number often means the stock is more 'expensive.'";
    case "P/B Ratio":
      return "Shows how the stock price compares to the company's accounting 'net worth' (book value); high means price is well above its balance-sheet value.";
    case "Dividend Yield":
      return "The percentage of your investment you'd get back in annual cash dividends (e.g., 3% means $3 per year on a $100 investment).";
    case "Revenue Growth":
      return "How much the company's total sales went up (or down) compared to last year, showing if the business is expanding or shrinking.";
    case "Profit Margin":
      return "Out of every dollar of sales, how much is left as profit after expenses (e.g., 20% margin means 20 cents of profit per $1 of revenue).";
    case "Return on Capital":
    case "Return on Capital (ROC or ROI)":
      return "Tells you how effectively the company uses its money and assets to make a profit (higher means better use of their property/investments).";
    case "3-Month Return":
    case "Three-Month Return":
      return "How the stock price changed over the last three months (e.g., +10% means it gained 10% in that period).";
    case "Relative Performance":
      return "Compares the stock's return to a major market index (e.g., if it's +5%, the stock did 5% better than the overall market).";
    case "RSI":
      return "A technical measure of recent price moves; below 40 often means it's been weak or 'oversold,' above 70 can mean it's 'overbought.'";
    case "Volatility":
      return "How much the stock's price bounces around day to day; higher volatility means the price can swing up or down more dramatically.";
    case "Beta":
      return "A measure of how much the stock tends to move relative to the overall market (e.g., a beta of 1.2 means it moves 20% more than the market).";
    case "Dividend Consistency":
      return "Whether the company reliably pays (and often increases) its dividend, or if it has a history of cutting or skipping dividend payments.";
    default:
      return "This metric helps evaluate the stock's performance relative to industry standards.";
  }
};

export default function MetricPopup({
  isOpen,
  onClose,
  metricName,
  metricColor,
  metricData,
}: MetricPopupProps) {
  const colorClass = getColorClass(metricColor);
  const bgColorClass = getBgColorClass(metricColor);
  const borderColorClass = getBorderColorClass(metricColor);

  // Generate explanation based on rating
  const getExplanation = () => {
    // Use the provided explanation if available
    if (metricData.explanation) {
      return metricData.explanation;
    }
    
    // Otherwise, generate a generic explanation based on the rating
    const { rating, industry } = metricData;
    
    // Handle positive ratings
    const positiveRatings = ["High", "Strong", "Good"];
    if (positiveRatings.includes(rating)) {
      switch (metricName) {
        case "Performance":
          return `This company demonstrates exceptional operational execution with impressive revenue growth and efficient capital utilization. This level of performance often indicates strong competitive advantages and effective management, positioning them well within the ${industry} sector.`;
        case "Stability":
          return `The stock exhibits remarkable price stability and lower volatility compared to both the market and its industry peers. This stability suggests a resilient business model and predictable cash flows, making it potentially suitable for more conservative investors within the ${industry} sector.`;
        case "Value":
          return `Currently trading at attractive valuation multiples relative to both its historical ranges and industry peers. This favorable pricing may indicate the stock is undervalued based on fundamentals, offering a potentially appealing entry point for investors interested in the ${industry} sector.`;
        case "Momentum":
          return `The stock is displaying strong positive price momentum, outperforming both the broader market and its sector peers. This upward trajectory often reflects growing investor confidence and improving business fundamentals within the ${industry} sector.`;
        default:
          return "This metric shows exceptional results, indicating strong prospects for future performance.";
      }
    }
    
    // Handle average ratings
    const averageRatings = ["Fair", "Average"];
    if (averageRatings.includes(rating)) {
      switch (metricName) {
        case "Performance":
          return `The company demonstrates adequate operational performance with reasonable growth metrics and capital efficiency. While not leading the ${industry} sector, they remain competitive and show balanced execution across key performance indicators.`;
        case "Stability":
          return `The stock exhibits average volatility and typical price movements for companies in the ${industry} sector. This moderate stability suggests a business model that responds predictably to normal market fluctuations.`;
        case "Value":
          return `Currently trading at valuation multiples that align with industry averages in the ${industry} sector. These fair valuations suggest the stock is reasonably priced relative to its fundamentals and growth prospects.`;
        case "Momentum":
          return `The stock is demonstrating modest price momentum, generally keeping pace with broader market and sector movements. This neutral momentum indicates steady, if unexceptional, investor sentiment in the ${industry} sector.`;
        default:
          return "This metric shows average results, indicating stable but not exceptional performance.";
      }
    }
    
    return {
      "Performance": `The company is showing below-average operational performance with challenges in growth metrics and capital efficiency. These limitations may indicate competitive pressures or internal challenges that are affecting their position in the ${industry} sector.`,
      "Stability": `The stock exhibits higher-than-average volatility with unpredictable price movements compared to peers in the ${industry} sector. This instability may reflect business model vulnerabilities or external factors creating uncertainty.`,
      "Value": `Currently trading at valuation multiples that exceed typical ranges for the ${industry} sector. These elevated valuations may indicate the stock is relatively expensive compared to its fundamentals or growth prospects.`,
      "Momentum": `The stock is demonstrating negative price momentum, underperforming both the broader market and sector peers. This downward trajectory often reflects investor concerns or deteriorating fundamentals within the ${industry} sector.`,
    }[metricName] || "This metric shows below-average results, indicating potential challenges for future performance.";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal - Enhanced Robinhood-inspired with depth and visual appeal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="relative w-[90%] max-w-md m-auto pointer-events-auto">
              {/* Shadow effect behind the modal */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-xl blur-md transform scale-[0.98] translate-y-1"></div>
              
              <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden relative z-10"
                style={{
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.05)'
                }}
              >
                {/* Top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  metricColor === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  metricColor === 'yellow' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                  'bg-gradient-to-r from-red-400 to-red-600'
                }`}></div>
                
                {/* Header - Enhanced design */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-b from-white to-slate-50">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg mr-3 shadow-md ${
                      metricColor === 'green' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                      metricColor === 'yellow' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                      'bg-gradient-to-br from-red-400 to-red-600'
                    } text-white`}>
                      {metricName === 'Performance' ? (
                        <TrendingUp size={18} />
                      ) : metricName === 'Value' ? (
                        <DollarSign size={18} />
                      ) : metricName === 'Stability' ? (
                        <Shield size={18} />
                      ) : (
                        <Zap size={18} />
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        {metricName} 
                        <span className={`ml-2 ${
                          metricColor === 'green' ? 'bg-green-100 text-green-600' :
                          metricColor === 'yellow' ? 'bg-amber-100 text-amber-600' :
                          'bg-red-100 text-red-600'
                        } text-sm font-medium px-2 py-0.5 rounded-full`}>
                          {metricData.rating}
                        </span>
                      </h2>
                      <p className="text-sm text-slate-600 font-medium">
                        {metricData.industry} Industry Overview
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                {/* Content - Enhanced with depth and visual appeal */}
                <div className="p-5 max-h-[70vh] overflow-y-auto bg-gradient-to-b from-white to-slate-50/60">
                  {/* Introduction section */}
                  <div className="mb-5 bg-white rounded-xl border border-slate-200 shadow-md p-4 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-transparent rounded-full opacity-70"></div>
                    <div className="flex items-start mb-2">
                      <div className="bg-blue-100 text-blue-600 p-1.5 rounded-md mr-2 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4" />
                          <path d="M12 8h.01" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-sm text-slate-800">Why These Metrics Matter</h3>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed relative z-10 pl-1">
                      These comparative metrics show how {metricData.name || "this company"} performs against industry standards. Key variations can indicate competitive advantages or potential risks.
                    </p>
                  </div>
                  
                  {/* Integrated Metrics with Explanations */}
                  <div className="space-y-5">
                    {metricData.values.map((item, index) => {
                      // Match up industry average for this metric
                      const industryAvg = metricData.industryAverage.find(
                        indItem => indItem.label === item.label
                      )?.value || "N/A";
                      
                      // Determine color based on comparison
                      const comparisonColor = getComparisonStatus(
                        item.value, 
                        item.industry || industryAvg,
                        isMetricBetterWhenLower(item.label)
                      );
                      
                      const textColorClass = getColorClass(comparisonColor);
                      const bgColorClass = getBgColorClass(comparisonColor);
                      const borderColorClass = getBorderColorClass(comparisonColor);
                      
                      // Create a state for each metric's tooltip
                      const [showTooltip, setShowTooltip] = useState(false);
                      
                      return (
                        <div key={index} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                          {/* Metric Header */}
                          <div className={`p-3 ${bgColorClass} border-b ${borderColorClass}`}>
                            <h3 className="text-slate-800 font-semibold flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex items-center cursor-pointer relative group">
                                  <Info size={18} className={`${textColorClass} mr-2 hover:scale-110 transition-transform`} />
                                  {item.label}
                                  
                                  <div className="fixed z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 
                                    transition-opacity duration-300 ease-in-out p-3 bg-white rounded-md
                                    shadow-lg border border-slate-200 text-xs text-slate-600 w-64"
                                    style={{ 
                                      transform: 'translate(-20px, -110%)',
                                      maxWidth: '250px',
                                      pointerEvents: 'none'
                                    }}>
                                    {getMetricDescription(item.label)}
                                    <div className="absolute -bottom-2 left-5 w-3 h-3 bg-white border-b border-r border-slate-200 transform rotate-45"></div>
                                  </div>
                                </div>
                              </div>
                            </h3>
                          </div>
                          
                          {/* Metric Content */}
                          <div className="p-4">
                            {/* Comparison Row */}
                            <div className="flex flex-col gap-3 mb-3">
                              <div className="flex justify-between items-center">
                                {/* Status badge */}
                                <div className={`px-3 py-1 rounded-full ${bgColorClass} text-xs font-medium uppercase ${textColorClass} shadow-sm border ${borderColorClass}`}>
                                  {comparisonColor === "green" ? "Better than Industry" : 
                                   comparisonColor === "yellow" ? "Industry Average" : "Below Industry Avg"}
                                </div>
                              </div>
                              
                              {/* Metric comparison */}
                              <div className="flex items-center justify-between w-full mt-2">
                                <div className="flex flex-col items-center">
                                  <span className="text-xs text-slate-800 mb-1.5 font-semibold">{metricData.name || "Company"}</span>
                                  <div className={`px-5 py-3 rounded-lg ${bgColorClass} ${textColorClass} font-bold text-2xl flex items-center justify-center min-w-24 shadow-md border ${borderColorClass} transform hover:scale-105 transition-all duration-150`}
                                    style={{
                                      boxShadow: comparisonColor === "green" ? "0 8px 16px rgba(34, 197, 94, 0.25), 0 2px 4px rgba(34, 197, 94, 0.15)" : 
                                               comparisonColor === "yellow" ? "0 8px 16px rgba(245, 158, 11, 0.25), 0 2px 4px rgba(245, 158, 11, 0.15)" :
                                               "0 8px 16px rgba(239, 68, 68, 0.25), 0 2px 4px rgba(239, 68, 68, 0.15)"
                                    }}>
                                    {item.value}{item.suffix || ""}
                                  </div>
                                </div>
                                
                                {/* Display comparison symbol with correct orientation */}
                                <div className="flex flex-col items-center justify-center">
                                  <div className={`${getColorClass(comparisonColor)} font-bold text-3xl flex items-center justify-center mx-2 p-1.5 rounded-full bg-white shadow-sm`}>
                                    {(() => {
                                      // Use correct arrows based on actual numeric values 
                                      const numValue = typeof item.value === 'string' ? parseFloat(item.value) : item.value;
                                      const industryValue = item.industry || industryAvg;
                                      const numIndustry = typeof industryValue === 'string' ? parseFloat(industryValue) : 
                                                          (typeof industryValue === 'number' ? industryValue : 0);
                                      
                                      if (isNaN(numValue) || isNaN(numIndustry)) {
                                        return <Minus size={30} className={getColorClass(comparisonColor)} />;
                                      }
                                      
                                      // Check if numbers are approximately equal (within 5%)
                                      const ratio = numValue / numIndustry;
                                      const isApproxEqual = ratio > 0.95 && ratio < 1.05;
                                      
                                      if (isApproxEqual) {
                                        return <span className={`${getColorClass(comparisonColor)} text-3xl font-semibold`}>~</span>;
                                      } else if (isMetricBetterWhenLower(item.label)) {
                                        // For metrics where lower is better (like P/E ratio, volatility)
                                        return numValue < numIndustry 
                                          ? <span className={`${getColorClass(comparisonColor)} text-3xl font-semibold`}>&lt;</span> // less than is good
                                          : <span className={`${getColorClass(comparisonColor)} text-3xl font-semibold`}>&gt;</span>; // greater than is bad
                                      } else {
                                        // For metrics where higher is better (like revenue growth)
                                        return numValue > numIndustry 
                                          ? <span className={`${getColorClass(comparisonColor)} text-3xl font-semibold`}>&gt;</span> // greater than is good
                                          : <span className={`${getColorClass(comparisonColor)} text-3xl font-semibold`}>&lt;</span>; // less than is bad
                                      }
                                    })()}
                                  </div>
                                </div>
                                
                                <div className="flex flex-col items-center">
                                  <span className="text-xs text-slate-800 mb-1.5 font-semibold">Industry Average</span>
                                  <div className="px-5 py-3 rounded-lg bg-slate-50 text-slate-600 font-bold text-2xl flex items-center justify-center min-w-24 shadow-md border border-slate-200 transform hover:scale-105 transition-all duration-150"
                                    style={{ boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.05)" }}>
                                    {item.industry || industryAvg}{item.suffix || ""}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Add 1-liner explanation if available */}
                            {item.explanation && (
                              <div className="mt-3 pt-3 border-t border-slate-100">
                                <p className="text-sm text-slate-600">{item.explanation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Overall Explanation */}
                  <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm">
                    <h3 className="text-slate-800 font-bold flex items-center mb-3">
                      {metricName === 'Performance' ? (
                        <TrendingUp size={16} className={`${colorClass} mr-2`} />
                      ) : metricName === 'Value' ? (
                        <DollarSign size={16} className={`${colorClass} mr-2`} />
                      ) : metricName === 'Stability' ? (
                        <Shield size={16} className={`${colorClass} mr-2`} />
                      ) : (
                        <Zap size={16} className={`${colorClass} mr-2`} />
                      )}
                      What This Means Overall
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {getExplanation()}
                    </p>
                  </div>
                  
                  {/* Footer */}
                  <div className="mt-6 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 italic">
                      These metrics are based on both historical data and forward-looking indicators. 
                      They should be used as one of many tools in your investment decision-making.
                    </p>
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