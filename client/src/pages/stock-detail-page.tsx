import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@shared/schema";
import { ArrowLeft, BellRing, Zap } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { StockData, getIndustryStocks } from "@/lib/stock-data";
import SimpleStackCard from "@/components/ui/simple-stack-card";
import RealTimeStockCard from "@/components/ui/real-time-stock-card";
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
        </div>
        <button className="text-green-400 hover:bg-gray-800 p-2 rounded-full transition-colors relative">
          <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>
          <BellRing size={20} />
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 relative">
        {stocks.length > 0 && (
          useRealTimeData ? (
            <RealTimeStockCard
              stock={currentStock}
              onNext={handleNextStock}
              onPrevious={handlePreviousStock}
              currentIndex={currentStockIndex}
              totalCount={stocks.length}
            />
          ) : (
            <SimpleStackCard
              stock={currentStock}
              onNext={handleNextStock}
              onPrevious={handlePreviousStock}
              currentIndex={currentStockIndex}
              totalCount={stocks.length}
              nextStock={nextStock}
            />
          )
        )}
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