import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@shared/schema";
import { ArrowLeft, BellRing, Zap } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { StockData, getIndustryStocks } from "@/lib/stock-data";
import StockCard from "@/components/ui/stock-card";
import StackCompletedModal from "@/components/stack-completed-modal";
import { motion } from "framer-motion";
import StackCardAnimated from "@/components/ui/stack-card-animated";

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 } 
  }
};

export default function StockDetailPage() {
  const { stackId } = useParams<{ stackId: string }>();
  const [_, setLocation] = useLocation();
  const [currentStockIndex, setCurrentStockIndex] = useState(0);
  const [completedModalOpen, setCompletedModalOpen] = useState(false);
  const [useRealTimeData, setUseRealTimeData] = useState(true);
  
  // Fetch stack data
  const { data: stack, isLoading } = useQuery<Stack>({
    queryKey: [`/api/stacks/${stackId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!stackId,
  });

  // Generate stocks data for the industry
  const stocks = useMemo(() => {
    if (!stack) return [];
    return getIndustryStocks(stack.industry);
  }, [stack]);

  // Handle navigation between stocks
  const handleNextStock = () => {
    if (currentStockIndex < stocks.length - 1) {
      setCurrentStockIndex(currentStockIndex + 1);
    } else {
      // Open completed modal when the user has swiped through all stocks
      setCompletedModalOpen(true);
    }
  };

  const handlePreviousStock = () => {
    if (currentStockIndex > 0) {
      setCurrentStockIndex(currentStockIndex - 1);
    }
  };

  // Handle resetting the stack to view again
  const handleResetStack = () => {
    setCurrentStockIndex(0);
    setCompletedModalOpen(false);
  };

  // Handle back button click
  const handleBack = () => {
    setLocation("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!stack || stocks.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col min-h-screen bg-black">
        <p className="text-white mb-4">No stocks available for this industry.</p>
        <button 
          onClick={handleBack}
          className="text-cyan-400 hover:bg-gray-800 px-4 py-2 rounded-full transition-colors border border-cyan-400"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentStock = stocks[currentStockIndex];
  
  // Get next stock for preview during swipes
  const nextStock = currentStockIndex < stocks.length - 1 
    ? stocks[currentStockIndex + 1] 
    : stocks[0]; // Loop back to the first stock if we're at the end

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-black text-white"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Header */}
      <motion.header 
        className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          delay: 0.1 
        }}
      >
        <motion.button 
          onClick={handleBack}
          className="text-cyan-400 hover:bg-gray-800 p-2 rounded-full transition-colors relative z-20"
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
        </motion.button>
        <motion.div 
          className="flex items-center gap-2 relative z-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h1 className="text-xl font-bold text-green-400">Swipefolio</h1>
          <motion.button
            onClick={() => setUseRealTimeData(!useRealTimeData)}
            className={`ml-2 text-xs px-3 py-1 rounded-full transition-colors ${
              useRealTimeData 
                ? 'bg-green-800 text-green-200 hover:bg-green-700' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {useRealTimeData ? 'Live Data' : 'Simple View'}
          </motion.button>
        </motion.div>
        <motion.button 
          className="text-green-400 hover:bg-gray-800 p-2 rounded-full transition-colors relative z-20"
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>
          <BellRing size={20} />
        </motion.button>
      </motion.header>

      {/* Main content */}
      <div className="flex-1 relative">
        {/* Show the initial category card before transitioning */}
        <motion.div
          className="absolute inset-0 z-0 flex items-center justify-center px-4 py-8"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="w-full max-w-md mx-auto">
            <StackCardAnimated 
              stack={stack}
              onClick={() => {}}
              category={stack.industry}
              isDetailPage={true}
            />
          </div>
        </motion.div>
        
        {/* Show the actual stock card with pop-up animation */}
        {stocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
              mass: 1,
              delay: 0.25,  // Delay slightly to allow the card animation to finish
              duration: 0.35
            }}
            className="flex-1 relative flex flex-col items-start z-10"
          >
            <StockCard
              stock={currentStock}
              onNext={handleNextStock}
              onPrevious={handlePreviousStock}
              currentIndex={currentStockIndex}
              totalCount={stocks.length}
              nextStock={nextStock}
              displayMode={useRealTimeData ? 'realtime' : 'simple'}
            />
          </motion.div>
        )}
      </div>

      {/* Modern Buy/Skip Buttons */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.4, 
          type: "spring", 
          stiffness: 400, 
          damping: 35 
        }}
      >
        <div className="flex justify-between gap-4 max-w-md mx-auto">
          <motion.button
            onClick={handlePreviousStock}
            className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium shadow-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={currentStockIndex === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 5 12 12 19"></polyline>
            </svg>
            Skip
          </motion.button>
          <motion.button
            onClick={() => {
              // Open portfolio impact calculator
              const stockCardElement = document.querySelector('[data-testid="stock-card"]');
              const buyButtonElement = stockCardElement?.querySelector('[data-testid="buy-button"]');
              
              if (buyButtonElement && 'click' in buyButtonElement) {
                (buyButtonElement as HTMLButtonElement).click();
              } else {
                // Fallback - just move to next stock
                handleNextStock();
              }
            }}
            className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium shadow-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"></path>
              <path d="M12 12h4l-1.8-1.8"></path>
              <path d="M14.2 13.8L16 12"></path>
              <circle cx="17" cy="7" r="3"></circle>
            </svg>
            Buy
          </motion.button>
        </div>
      </motion.div>

      {/* Completed modal */}
      <StackCompletedModal
        isOpen={completedModalOpen}
        onClose={() => setCompletedModalOpen(false)}
        onReset={handleResetStack}
        stackName={stack?.title || ""}
        stocksCount={stocks.length}
      />
    </motion.div>
  );
}