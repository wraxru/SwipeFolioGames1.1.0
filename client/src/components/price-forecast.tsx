import { Lock, Info } from 'lucide-react';

interface PriceForecastProps {
  ticker: string;
  currentPrice: number;
  oneYearReturn: number | string;
  isPremium?: boolean;
}

export default function PriceForecast({ 
  ticker, 
  currentPrice, 
  oneYearReturn, 
  isPremium = false 
}: PriceForecastProps) {
  // Parse the one year return to ensure it's a number
  const parsedOneYearReturn = typeof oneYearReturn === 'string' 
    ? parseFloat(oneYearReturn.replace('%', '')) 
    : oneYearReturn;
  
  // Calculate the predicted price
  const predictedPrice = currentPrice * (1 + parsedOneYearReturn / 100);
  const formattedPredictedPrice = predictedPrice.toFixed(2);
  
  // Format year return display
  const returnDisplay = parsedOneYearReturn > 0 
    ? `+${parsedOneYearReturn.toFixed(2)}%` 
    : `${parsedOneYearReturn.toFixed(2)}%`;
  
  const returnColor = parsedOneYearReturn >= 0 ? 'text-emerald-600' : 'text-red-500';
  
  return (
    <div className="mb-4">
      {/* Header with title and premium badge */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <h3 className="text-gray-800 font-medium">Price Forecast</h3>
          <span className="ml-1.5 text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">AI</span>
        </div>
        
        <div className="flex items-center">
          {!isPremium && (
            <div className="mr-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2 py-0.5 rounded-full flex items-center">
              <Lock className="h-3 w-3 mr-1" />
              <span>Premium</span>
            </div>
          )}
          <Info className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {/* Main content with return and price */}
      <div className="flex justify-between mb-2">
        <div>
          <p className="text-sm text-gray-500">1-year return</p>
          <p className={`text-xl font-bold ${returnColor}`}>{returnDisplay}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current price</p>
          <p className="text-xl font-bold text-gray-800">${currentPrice.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Forecast box with premium lock */}
      <div className="bg-white border border-gray-200 rounded-lg relative">
        <div className="flex items-center justify-center py-3 px-4">
          {!isPremium && (
            <>
              <div className="blur-[3px] opacity-40 absolute inset-0 pointer-events-none">
                <p className="text-lg font-semibold text-gray-800">${formattedPredictedPrice}</p>
              </div>
              <div className="flex flex-col items-center z-10">
                <Lock className="h-5 w-5 text-gray-500 mb-1" />
                <p className="text-sm font-medium text-gray-700 mb-2">Unlock premium forecast</p>
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm py-1 px-4 rounded-full transition-colors">
                  Upgrade
                </button>
              </div>
            </>
          )}
          
          {isPremium && (
            <div className="flex justify-between w-full">
              <div>
                <p className="text-sm text-gray-500">Expected price (1yr)</p>
                <p className="text-xl font-bold text-gray-800">${formattedPredictedPrice}</p>
              </div>
              <div className={`text-xl font-bold ${returnColor} flex items-center`}>
                {returnDisplay}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Disclaimer text */}
      <p className="text-xs text-gray-500 mt-2">
        Based on historical performance and market conditions. Not financial advice.
      </p>
    </div>
  );
}