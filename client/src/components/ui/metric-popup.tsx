import React from "react";
import { X, Info, TrendingUp, ArrowRight, PlusCircle, CircleDot, ChevronUp, ChevronDown, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Utility functions for comparison
// Get comparison status (better, similar, worse)
function getComparisonStatus(value: number | string, industry: number | string, 
                          isLowerBetter: boolean = false): "green" | "yellow" | "red" {
  // Parse string values to numbers if possible
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
      return "bg-green-50";
    case "yellow":
      return "bg-amber-50";
    case "red":
      return "bg-red-50";
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
  symbol: "<" | "=" | ">", 
  color: "green" | "yellow" | "red" 
}) => {
  const textColorClass = getColorClass(color);
  
  return (
    <div className={`flex items-center justify-center ${textColorClass} font-bold text-lg mx-1`}>
      {symbol === ">" && <ChevronUp size={18} className={textColorClass} />}
      {symbol === "=" && <Minus size={18} className={textColorClass} />}
      {symbol === "<" && <ChevronDown size={18} className={textColorClass} />}
    </div>
  );
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
          
          {/* Modal - Robinhood-inspired */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden w-[90%] max-w-md m-auto pointer-events-auto"
              style={{
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              {/* Header - Simplified Robinhood style */}
              <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full mr-2 ${bgColorClass} border ${borderColorClass}`}>
                    <TrendingUp size={14} className={colorClass} />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-800">
                      {metricName} <span className={`${colorClass} text-sm font-medium`}>• {metricData.rating}</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      {metricData.industry} industry metrics
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                {/* Integrated Metrics with Explanations */}
                <div className="space-y-4">
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
                    
                    return (
                      <div key={index} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        {/* Metric Header */}
                        <div className={`p-3 ${bgColorClass} border-b ${borderColorClass}`}>
                          <h3 className="text-slate-800 font-semibold flex items-center">
                            <Info size={16} className={`${textColorClass} mr-2`} />
                            {item.label}
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
                                <span className="text-xs text-slate-500 mb-1.5 font-medium">Company</span>
                                <div className={`px-4 py-2 rounded-lg ${bgColorClass} ${textColorClass} font-bold text-base flex items-center justify-center min-w-20 shadow-sm border ${borderColorClass}`}>
                                  {item.value}{item.suffix || ""}
                                </div>
                              </div>
                              
                              {/* Display comparison symbol instead of arrow */}
                              <ComparisonSymbol 
                                symbol={getComparisonSymbol(
                                  item.value, 
                                  item.industry || industryAvg,
                                  isMetricBetterWhenLower(item.label)
                                )} 
                                color={comparisonColor} 
                              />
                              
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-slate-500 mb-1.5 font-medium">Industry Avg</span>
                                <div className="px-4 py-2 rounded-lg bg-slate-50 text-slate-600 font-bold text-base flex items-center justify-center min-w-20 shadow-sm border border-slate-200">
                                  {item.industry || industryAvg}{item.suffix || ""}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Overall Explanation */}
                <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm">
                  <h3 className="text-slate-800 font-bold flex items-center mb-3">
                    <TrendingUp size={16} className={`${colorClass} mr-2`} />
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}