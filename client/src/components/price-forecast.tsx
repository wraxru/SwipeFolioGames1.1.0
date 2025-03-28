import React from 'react';
import { TrendingUp, Lock } from 'lucide-react';
import { StockData } from '@/lib/stock-data';

interface PriceForecastProps {
  stock: StockData;
  isPremium?: boolean;
}

/**
 * A component that displays the 1-year return and predicted price
 * with the predicted price blurred for non-premium users
 */
const PriceForecast: React.FC<PriceForecastProps> = ({ 
  stock,
  isPremium = false // Default to non-premium
}) => {
  // Get the oneYearReturn and predictedPrice from the stock data
  const { oneYearReturn, predictedPrice, ticker } = stock;
  
  // Calculate whether the 1-year return is positive
  const isPositiveReturn = oneYearReturn && oneYearReturn.startsWith('+') || 
    (oneYearReturn && !oneYearReturn.startsWith('-'));
  
  // Return null if we don't have both data points
  if (!oneYearReturn && !predictedPrice) {
    return null;
  }

  return (
    <div className="mt-6 mb-2">
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        {/* Header with subtle gradient */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">Future Outlook</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">Price prediction based on historical data and market trends</p>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="grid grid-cols-2 gap-6">
            {/* 1-Year Return */}
            {oneYearReturn && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">1-Year Return</span>
                <div className="flex items-baseline">
                  <span className={`text-xl font-bold ${isPositiveReturn ? 'text-green-600' : 'text-red-600'}`}>
                    {oneYearReturn}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Historical return from the past year
                </p>
              </div>
            )}
            
            {/* Predicted Price - Blurred for non-premium */}
            {predictedPrice && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-gray-500">Predicted Price</span>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
                    Premium
                  </div>
                </div>
                
                <div className="flex items-center mt-1">
                  {isPremium ? (
                    <span className="text-xl font-bold text-blue-600">{predictedPrice}</span>
                  ) : (
                    <div className="relative">
                      {/* Blurred version */}
                      <div className="filter blur-sm select-none text-xl font-bold text-blue-600">
                        {predictedPrice}
                      </div>
                      {/* Lock icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-1">
                  Expected price in 12 months
                </p>
              </div>
            )}
          </div>
          
          {/* Premium Upgrade CTA for non-premium users */}
          {!isPremium && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm"
              >
                Upgrade to Premium
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Get access to price predictions and advanced insights
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceForecast;