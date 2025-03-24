import React from "react";
import { X, Info, TrendingUp, ArrowRight, PlusCircle, CircleDot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    rating: "High" | "Strong" | "Fair" | "Low" | "Unstable" | "Weak";
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
      return "text-green-500";
    case "yellow":
      return "text-yellow-500";
    case "red":
      return "text-red-500";
    default:
      return "text-white";
  }
};

const getBgColorClass = (color: "green" | "yellow" | "red") => {
  switch (color) {
    case "green":
      return "bg-green-900/40";
    case "yellow":
      return "bg-yellow-900/40";
    case "red":
      return "bg-red-900/40";
    default:
      return "bg-gray-900/40";
  }
};

const getBorderColorClass = (color: "green" | "yellow" | "red") => {
  switch (color) {
    case "green":
      return "border-green-500/30";
    case "yellow":
      return "border-yellow-500/30";
    case "red":
      return "border-red-500/30";
    default:
      return "border-gray-700";
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
    
    if (rating === "High" || rating === "Strong") {
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
    
    if (rating === "Fair") {
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

  // Get value comparison status (better, similar, worse)
  const getComparisonStatus = (value: number | string, industry: number | string): "green" | "yellow" | "red" => {
    // Handle string values
    if (typeof value === 'string' || typeof industry === 'string') {
      return "yellow"; // Default to neutral for string comparisons
    }
    
    // Handle numeric values
    // For metrics where higher is better (like revenue growth)
    if (value > industry * 1.1) return "green";
    if (value < industry * 0.9) return "red";
    return "yellow";
    
    // Note: In a real implementation, we'd have logic to handle metrics
    // where lower is better (like volatility) or specific thresholds
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden w-[90%] max-w-md m-auto pointer-events-auto">
              {/* Header */}
              <div className={`p-4 ${bgColorClass} border-b ${borderColorClass}`}>
                <div className="flex justify-between items-center">
                  <h2 className={`text-xl font-bold ${colorClass}`}>
                    {metricName}: <span className={colorClass}>{metricData.rating}</span>
                  </h2>
                  <button 
                    onClick={onClose}
                    className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-300 mt-1">
                  Key metrics for {metricName.toLowerCase()} in the {metricData.industry} industry
                </p>
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
                      item.industry || industryAvg
                    );
                    
                    const textColorClass = getColorClass(comparisonColor);
                    const bgColorClass = getBgColorClass(comparisonColor);
                    const borderColorClass = getBorderColorClass(comparisonColor);
                    
                    return (
                      <div key={index} className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                        {/* Metric Header */}
                        <div className={`p-3 ${bgColorClass} border-b ${borderColorClass}`}>
                          <h3 className="text-white font-semibold flex items-center">
                            <Info size={14} className={`${textColorClass} mr-2`} />
                            {item.label}
                          </h3>
                        </div>
                        
                        {/* Metric Content */}
                        <div className="p-3">
                          {/* Comparison Row */}
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center">
                              <div className={`px-3 py-1 rounded-full ${bgColorClass} ${textColorClass} font-medium text-sm`}>
                                {item.value}{item.suffix || ""}
                              </div>
                              <ArrowRight size={14} className="mx-2 text-gray-500" />
                              <div className="text-gray-400 text-sm">
                                Industry: {item.industry || industryAvg}{item.suffix || ""}
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded-full ${bgColorClass} text-xs font-medium uppercase ${textColorClass}`}>
                              {comparisonColor === "green" ? "Better" : 
                               comparisonColor === "yellow" ? "Average" : "Below Avg"}
                            </div>
                          </div>
                          
                          {/* Explanation */}
                          <p className="text-sm text-gray-300">
                            {item.explanation || 
                             `This shows how the company's ${item.label.toLowerCase()} compares to the ${metricData.industry} industry average.`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Overall Explanation */}
                <div className="mt-6 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <h3 className="text-white font-semibold flex items-center mb-2">
                    <TrendingUp size={14} className={`${colorClass} mr-2`} />
                    What This Means Overall
                  </h3>
                  <p className="text-sm text-gray-300">
                    {getExplanation()}
                  </p>
                </div>
                
                {/* Footer */}
                <div className="mt-6 pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-500 italic">
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