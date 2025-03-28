import React, { useState, useEffect } from 'react';
import { Lock, ArrowUpRight, Sparkles } from 'lucide-react';
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
  // Animation state for shimmer effect
  const [showShimmer, setShowShimmer] = useState(true);
  
  // Get the oneYearReturn and predictedPrice from the stock data
  const { oneYearReturn, predictedPrice, ticker } = stock;
  
  // Calculate whether the 1-year return is positive
  const isPositiveReturn = oneYearReturn && oneYearReturn.startsWith('+') || 
    (oneYearReturn && !oneYearReturn.startsWith('-'));
  
  // Shimmer effect animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowShimmer((prev) => !prev);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Return null if we don't have both data points
  if (!oneYearReturn && !predictedPrice) {
    return null;
  }

  return (
    <div className="mt-6 mb-2">
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-md">
        {/* Header with enhanced gradient */}
        <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-gray-200 relative overflow-hidden">
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" 
               style={{ 
                 backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%232E3A59\" fill-opacity=\"0.15\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')"
               }}>
          </div>
          
          {/* Custom telescope icon for forward-looking insights */}
          <div className="flex items-center">
            <div className="mr-3 p-2 bg-blue-100 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L18 10M18 10H14M18 10V14" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V16M12 16L6 10M12 16L8 20" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="8" r="2" stroke="#4F46E5" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-gray-800">Future Outlook</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1 ml-11">Price prediction based on historical data and market trends</p>
        </div>
        
        {/* Content */}
        <div className="p-5 bg-gradient-to-b from-white to-blue-50/20">
          <div className="grid grid-cols-2 gap-6">
            {/* 1-Year Return */}
            {oneYearReturn && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600 mb-1">1-Year Return</span>
                <div className="flex items-center">
                  <span className={`text-xl font-bold ${isPositiveReturn ? 'text-emerald-500' : 'text-red-500'}`}>
                    {oneYearReturn}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Historical return from the past year
                </p>
              </div>
            )}
            
            {/* Predicted Price - Enhanced premium styling */}
            {predictedPrice && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-gray-600">Predicted Price</span>
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Premium
                  </div>
                </div>
                
                <div className="flex items-center mt-1">
                  {isPremium ? (
                    <span className="text-xl font-bold text-indigo-600">{predictedPrice}</span>
                  ) : (
                    <div className="relative">
                      {/* Blurred version with shimmer */}
                      <div className={`filter blur-sm select-none text-xl font-bold text-indigo-600 relative ${showShimmer ? 'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:animate-shimmer' : ''}`}>
                        {predictedPrice}
                      </div>
                      {/* Enhanced lock icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-indigo-100 rounded-full p-1">
                          <Lock className="h-4 w-4 text-indigo-500" />
                        </div>
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
          
          {/* Enhanced Premium Upgrade CTA for non-premium users */}
          {!isPremium && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button 
                className="group w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Upgrade to Premium
                  <ArrowUpRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
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