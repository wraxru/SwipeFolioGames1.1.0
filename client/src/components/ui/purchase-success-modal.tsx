import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, TrendingUp } from "lucide-react";
import { StockData } from "@/lib/stock-data";

interface PurchaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockData;
  shares: number;
  amount: number;
  projectedReturn: number;
}

export default function PurchaseSuccessModal({
  isOpen,
  onClose,
  stock,
  shares,
  amount,
  projectedReturn,
}: PurchaseSuccessModalProps) {
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Semi-transparent backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />
          
          {/* Success modal with green background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="success-modal fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
                       w-[90%] max-w-md rounded-xl overflow-hidden bg-gradient-to-b from-green-500 to-green-600 
                       shadow-2xl border border-green-400"
          >
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b border-green-400">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-2 mr-3">
                  <Check size={20} className="text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-white">Congratulations!</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors
                           flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 text-white">
              <div className="mb-5 text-center">
                <p className="text-lg font-medium mb-2">
                  You've successfully purchased
                </p>
                <p className="text-3xl font-bold mb-1">
                  {shares.toFixed(4)} shares
                </p>
                <p className="text-xl font-semibold mb-4">
                  of {stock.name} ({stock.ticker})
                </p>
                
                <div className="flex justify-center items-center space-x-3 mb-2">
                  <div className="bg-white/20 px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium">Investment</p>
                    <p className="text-xl font-bold">{formatCurrency(amount)}</p>
                  </div>
                  
                  <div className="flex items-center text-white/60">
                    <TrendingUp size={20} />
                  </div>
                  
                  <div className="bg-white/20 px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium">Projected Return</p>
                    <p className="text-xl font-bold">{formatCurrency(projectedReturn)}</p>
                  </div>
                </div>
              </div>
              
              {/* Action button */}
              <button
                onClick={onClose}
                className="w-full py-3 bg-white rounded-lg text-green-600 font-bold text-lg
                           hover:bg-green-50 transition-colors shadow-md"
              >
                Continue Investing
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}