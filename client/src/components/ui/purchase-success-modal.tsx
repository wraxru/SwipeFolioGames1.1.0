import React, { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, TrendingUp } from "lucide-react";
import { StockData } from "@/lib/stock-data";
import ReactCanvasConfetti from "react-canvas-confetti";

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
  // Confetti reference and animation controls
  const refAnimationInstance = useRef<any>(null);
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Get confetti instance
  const getInstance = useCallback((instance: any) => {
    refAnimationInstance.current = instance;
  }, []);

  // Fire confetti
  const makeShot = useCallback((particleRatio: number, opts: any) => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
    }
  }, []);

  // Realistic confetti effect
  const fireConfetti = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#26a269', '#2ec27e', '#33d17a', '#57e389', '#8ff0a4'],
    });

    makeShot(0.2, {
      spread: 60,
      colors: ['#f6d32d', '#f9f06b', '#ffbe6f', '#ff7800'],
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#1c71d8', '#62a0ea', '#99c1f1', '#3584e4'],
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#c061cb', '#dc8add', '#e29ffc', '#ad65d6'],
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#ed333b', '#ff7b39', '#ffbe6f', '#f66151'],
    });
  }, [makeShot]);

  // Body lock when modal is open and trigger confetti
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Delay confetti slightly for better effect
      const timer = setTimeout(() => {
        fireConfetti();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, fireConfetti]);

  return (
    <AnimatePresence mode="wait" key="success-modal">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]" style={{ isolation: 'isolate' }}>
          {/* Confetti canvas */}
          <ReactCanvasConfetti
            ref={getInstance}
            style={{
              position: 'fixed',
              pointerEvents: 'none',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              zIndex: 55
            }}
          />
        
          {/* iOS-friendly backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 bg-black"
            style={{ zIndex: 50 }}
            onClick={onClose}
          />
          
          {/* Success modal with iOS-optimized animations and improved timing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.35, 
              ease: 'easeOut',
              delay: 0.15 // Increased delay for more satisfying effect
            }}
            className="w-[80%] max-w-xs mx-auto rounded-xl overflow-hidden bg-gradient-to-b from-green-500 to-green-600 
                       shadow-2xl border border-green-400"
            style={{
              zIndex: 52,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.6)'
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
        </div>
      )}
    </AnimatePresence>
  );
}