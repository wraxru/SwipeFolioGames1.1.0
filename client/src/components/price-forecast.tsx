import { Lock, Info, AlertCircle } from 'lucide-react';

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
    <div className="border-t border-gray-200 pt-3 pb-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          Price Forecast
          <span className="ml-1.5 text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">AI</span>
        </h3>
        <div className="flex items-center">
          {!isPremium && (
            <div className="text-amber-800 bg-amber-50 text-xs px-2 py-0.5 rounded-full flex items-center border border-amber-200">
              <Lock className="h-3 w-3 mr-1" />
              <span>Premium</span>
            </div>
          )}
          <Info className="h-4 w-4 text-gray-400 ml-1" />
        </div>
      </div>
      
      <div className="flex justify-between mb-2">
        <div>
          <p className="text-xs text-gray-500">1-year return</p>
          <p className={`text-base font-semibold ${returnColor}`}>{returnDisplay}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Current price</p>
          <p className="text-base font-semibold text-gray-800">${currentPrice.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 relative mb-2">
        {!isPremium && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/70 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <Lock className="h-4 w-4 mx-auto mb-1 text-gray-500" />
              <p className="text-xs font-medium text-gray-700">Unlock premium forecast</p>
              <button className="mt-1 bg-indigo-500 text-white text-xs py-1 px-3 rounded-full">
                Upgrade
              </button>
            </div>
          </div>
        )}
        
        <div className={!isPremium ? "blur-[2px] opacity-60" : ""}>
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500">Expected price (1yr)</p>
              <p className="text-sm font-semibold text-gray-800">
                ${isPremium ? formattedPredictedPrice : "XX.XX"}
              </p>
            </div>
            <div className={`text-base font-bold ${returnColor}`}>
              {returnDisplay}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-start text-xs text-gray-500">
        <AlertCircle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
        <p>Based on historical performance and market conditions. Not financial advice.</p>
      </div>
    </div>
  );
}