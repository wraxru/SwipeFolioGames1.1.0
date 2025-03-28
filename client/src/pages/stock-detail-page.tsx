import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@shared/schema";
import { ArrowLeft, BellRing } from "lucide-react";
// Make sure AnimatePresence is imported
import { motion, AnimatePresence } from "framer-motion";
import { getQueryFn } from "@/lib/queryClient";
import { StockData, getIndustryStocks } from "@/lib/stock-data";
import StockCard from "@/components/ui/stock-card";
import StackCompletedModal from "@/components/stack-completed-modal";

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
    // ... loading state ...
    return (
       <div className="flex items-center justify-center min-h-screen bg-black">
         <div className="animate-spin w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
       </div>
     );
  }

  if (!stack || stocks.length === 0) {
    // ... error state ...
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

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
         <button
           onClick={handleBack}
           className="text-cyan-400 hover:bg-gray-800 p-2 rounded-full transition-colors"
         >
           <ArrowLeft size={20} />
         </button>
         <div className="flex items-center gap-2">
           <h1 className="text-xl font-bold text-green-400">Swipefolio</h1>
           {/* Removed the Live Data/Simple View toggle for simplicity, add back if needed */}
         </div>
         <button className="text-green-400 hover:bg-gray-800 p-2 rounded-full transition-colors relative">
           <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>
           <BellRing size={20} />
         </button>
       </header>

      {/* Main content - Card Stacking Area */}
      <div className="flex-1 relative overflow-hidden">
         {/* AnimatePresence handles the exit/enter animations based on key changes */}
        <AnimatePresence initial={false}>
          {/* Render Next Card (if exists) - Positioned behind */}
          {currentStockIndex + 1 < stocks.length && (
            <motion.div
              key={`stackcard-${currentStockIndex + 1}`} // Key changes when card position changes
              className="absolute inset-0 p-4"
              style={{ zIndex: 1 }}
              initial={{ scale: 0.95, y: 15, opacity: 0.8 }} // Initial state for card behind
              animate={{ scale: 0.95, y: 15, opacity: 0.8 }} // Keep it scaled down and offset
              exit={{ scale: 0.9, y: 30, opacity: 0 }} // How it animates out when it's no longer the next card
              transition={{ type: 'spring', stiffness: 500, damping: 50 }}
            >
              <div style={{ pointerEvents: 'none', height: '100%', width: '100%' }}> {/* Prevent interaction */}
                <StockCard
                  stock={stocks[currentStockIndex + 1]}
                  onNext={() => {}}
                  onPrevious={() => {}}
                  currentIndex={currentStockIndex + 1}
                  totalCount={stocks.length}
                  displayMode={useRealTimeData ? 'realtime' : 'simple'}
                />
              </div>
            </motion.div>
          )}

          {/* Render Current Card - Positioned on top */}
          {currentStock && (
             <motion.div
               key={`stackcard-${currentStockIndex}`} // Key changes when card position changes
               className="absolute inset-0 p-4"
               style={{ zIndex: 2 }}
               initial={{ scale: 1, y: 0, opacity: 1 }} // Should already be in position
               animate={{ scale: 1, y: 0, opacity: 1 }}
               // Exit animation is handled by the drag gesture in StockCard
               // No layout prop needed here as drag handles position
             >
              {/* This StockCard's internal motion.div handles the dragging */}
              <StockCard
                stock={currentStock}
                onNext={handleNextStock}
                onPrevious={handlePreviousStock}
                currentIndex={currentStockIndex}
                totalCount={stocks.length}
                displayMode={useRealTimeData ? 'realtime' : 'simple'}
              />
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Buy/Skip Buttons */}
       <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent z-10">
         <div className="flex justify-between gap-4 max-w-md mx-auto">
           <button
             onClick={handlePreviousStock} // Changed to call handlePreviousStock which handles index > 0
             className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium shadow-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             disabled={currentStockIndex === 0}
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <line x1="19" y1="12" x2="5" y2="12"></line>{/* Corrected skip arrow */}
               <polyline points="12 19 5 12 12 5"></polyline>
             </svg>
             Skip
           </button>
           <button
             onClick={() => {
               // Trigger the hidden buy button inside the CURRENT StockCard
               const currentCardDiv = document.querySelector<HTMLElement>(`[key='stackcard-${currentStockIndex}']`);
               const buyButton = currentCardDiv?.querySelector<HTMLButtonElement>('[data-testid="buy-button"]');
               buyButton?.click();
             }}
             className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
           >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"></path>
                 <path d="M12 12h4l-1.8-1.8"></path>
                 <path d="M14.2 13.8L16 12"></path>
                 <circle cx="17" cy="7" r="3"></circle>
               </svg>
             Buy
           </button>
         </div>
       </div>

      {/* Completed modal */}
      <StackCompletedModal
        isOpen={completedModalOpen}
        onClose={() => setCompletedModalOpen(false)}
        onReset={handleResetStack}
        stackName={stack?.title || ""}
        stocksCount={stocks.length}
      />
    </div>
  );
}