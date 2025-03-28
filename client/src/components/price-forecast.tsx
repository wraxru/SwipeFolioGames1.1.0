import { Lock, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="relative mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-slate-800 font-medium flex items-center">
          Price Forecast
          <span className="ml-1.5 text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">AI</span>
        </h3>
        <div className="flex items-center">
          {!isPremium && (
            <div className="mr-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full flex items-center">
              <Lock className="h-3 w-3 mr-1" />
              <span>Premium</span>
            </div>
          )}
          <Info className="h-4 w-4 text-slate-400" />
        </div>
      </div>
      
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 opacity-50" />
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-20 h-20 border border-slate-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `scale(${Math.random() * 0.8 + 0.5})`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500">1-year return</p>
              <p className={`text-lg font-bold ${returnColor}`}>{returnDisplay}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Current price</p>
              <p className="text-lg font-bold text-slate-800">${currentPrice.toFixed(2)}</p>
            </div>
          </div>
          
          {isPremium ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Expected price (1yr)</p>
                  <p className="text-xl font-bold text-slate-800">${formattedPredictedPrice}</p>
                </div>
                <div className={`text-2xl font-bold ${returnColor}`}>
                  {returnDisplay}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-slate-200 shadow-sm relative">
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[6px] z-10 bg-white/60 rounded-lg">
                <div className="text-center">
                  <Lock className="h-5 w-5 mx-auto mb-2 text-slate-500" />
                  <p className="text-sm font-medium text-slate-700">Unlock premium forecast</p>
                  <button className="mt-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm py-1 px-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
                    Upgrade
                  </button>
                </div>
              </div>
              
              {/* Blurred content */}
              <div className="flex items-center justify-between opacity-70 blur-[3px]">
                <div>
                  <p className="text-sm text-slate-500">Expected price (1yr)</p>
                  <p className="text-xl font-bold text-slate-800">$XXX.XX</p>
                </div>
                <div className={`text-2xl font-bold ${returnColor}`}>
                  {returnDisplay}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-3 flex items-start text-xs text-slate-500">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 mr-1.5 flex-shrink-0" />
            <p>Based on historical performance and market conditions. Not financial advice.</p>
          </div>
        </div>
      </div>
    </div>
  );
}