import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Home, Repeat } from "lucide-react";
import { useLocation } from "wouter";

interface StackCompletedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  stackName: string;
  stocksCount: number;
}

export default function StackCompletedModal({
  isOpen,
  onClose,
  onReset,
  stackName,
  stocksCount
}: StackCompletedModalProps) {
  const [_, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md bg-gray-900 rounded-xl p-6 shadow-xl border border-cyan-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-cyan-500/20 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-cyan-400" />
              </div>
              
              <h2 className="text-xl font-bold mb-2">Stack Completed!</h2>
              
              <p className="text-gray-400 mb-4">
                You've viewed all {stocksCount} stocks in the <span className="text-cyan-400">{stackName}</span> stack.
              </p>
              
              <div className="w-full bg-gray-800 h-1 rounded-full mb-6 overflow-hidden">
                <div className="bg-cyan-400 h-full w-full" />
              </div>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  <Home size={18} />
                  Home
                </button>
                
                <button
                  onClick={onReset}
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  <Repeat size={18} />
                  View Again
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}