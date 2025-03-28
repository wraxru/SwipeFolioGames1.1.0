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
    <AnimatePresence mode="wait" key="success-modal">
      {isOpen && (
        <>
          {/* Semi-transparent backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-[59]"
            onClick={onClose}
          />
          
          {/* Success modal with green background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="success-modal fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60]
                       w-[85%] max-w-xs rounded-xl overflow-hidden bg-gradient-to-b from-green-500 to-green-600 
                       shadow-2xl border border-green-400"
            style={{
              boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.25), 0 12px 25px -10px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Header with close button */}
            <div className="flex justify-between items-center p-3 border-b border-green-400">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-1.5 mr-2">
                  <Check size={16} className="text-green-600" />
                </div>
                <h2 className="text-lg font-bold text-white">Congratulations!</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors
                           flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 text-white">
              <div className="mb-4 text-center">
                <p className="text-2xl font-bold mb-1">
                  {shares.toFixed(4)} shares
                </p>
                <p className="text-lg font-semibold mb-3">
                  of {stock.name} ({stock.ticker})
                </p>
                
                <div className="flex justify-center items-center space-x-2 mb-2">
                  <div className="bg-white/20 px-3 py-1.5 rounded-lg flex-1">
                    <p className="text-xs font-medium">Investment</p>
                    <p className="text-lg font-bold">{formatCurrency(amount)}</p>
                  </div>
                  
                  <div className="flex items-center text-white/60">
                    <TrendingUp size={16} />
                  </div>
                  
                  <div className="bg-white/20 px-3 py-1.5 rounded-lg flex-1">
                    <p className="text-xs font-medium">Projected Return</p>
                    <p className="text-lg font-bold">{formatCurrency(projectedReturn)}</p>
                  </div>
                </div>
              </div>
              
              {/* Action button */}
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-white rounded-lg text-green-600 font-bold text-base
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