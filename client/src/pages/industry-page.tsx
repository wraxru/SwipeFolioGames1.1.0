import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, BellRing, Zap } from "lucide-react";
import { StockData, getIndustryStocks } from "@/lib/stock-data";
import StockCard from "@/components/ui/stock-card";
import StackCompletedModal from "@/components/stack-completed-modal";

export default function IndustryPage() {
  const { industryName } = useParams<{ industryName: string }>();
  const [_, setLocation] = useLocation();
  const [currentStockIndex, setCurrentStockIndex] = useState(0);
  const [completedModalOpen, setCompletedModalOpen] = useState(false);
  const [useRealTimeData, setUseRealTimeData] = useState(true);
  
  // Decode industry name from URL
  const decodedIndustryName = useMemo(() => {
    return industryName ? decodeURIComponent(industryName) : "";
  }, [industryName]);
  
  // Generate stocks data for the industry
  const stocks = useMemo(() => {
    if (!decodedIndustryName) return [];
    console.log("Fetching stocks for industry:", decodedIndustryName);
    const industryStocks = getIndustryStocks(decodedIndustryName);
    console.log(`Found ${industryStocks.length} stocks for industry ${decodedIndustryName}`);
    return industryStocks;
  }, [decodedIndustryName]);

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
  const handleReset = () => {
    setCurrentStockIndex(0);
    setCompletedModalOpen(false);
  };

  // Return to stacks explorer
  const handleBackClick = () => {
    setLocation("/"); // Go back to home/stacks
  };

  // If industry doesn't have any stocks, show a message
  if (stocks.length === 0 && decodedIndustryName) {
    return (
      <div className="flex flex-col items-center justify-center p-6 mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No Stocks Available</h2>
        <p className="text-gray-600 mb-6">
          We couldn't find any stocks for the {decodedIndustryName} industry.
        </p>
        <button
          onClick={handleBackClick}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Stacks
        </button>
      </div>
    );
  }

  // Get industry display name for header
  const getIndustryDisplayName = () => {
    // Map of industry codes to display names
    const displayNames: Record<string, string> = {
      "Tech": "Tech Titans",
      "Healthcare": "Med-Tech Innovators",
      "Retail": "Retail Champions",
      "Real Estate": "Property Players",
      "ESG": "Green Giants",
    };
    
    return displayNames[decodedIndustryName] || decodedIndustryName;
  };

  return (
    <div className="stock-detail-page">
      {/* Header Bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b relative z-10">
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </button>
        
        <div className="flex space-x-3">
          <h1 className="text-lg font-semibold">{getIndustryDisplayName()}</h1>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <BellRing className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stock Card Area */}
      <div className="relative w-full h-full py-4">
        {stocks.length > 0 && (
          <StockCard
            stock={stocks[currentStockIndex]}
            onNext={handleNextStock}
            onPrevious={handlePreviousStock}
            currentIndex={currentStockIndex}
            totalCount={stocks.length}
            nextStock={currentStockIndex < stocks.length - 1 ? stocks[currentStockIndex + 1] : undefined}
            displayMode="simple"
          />
        )}
      </div>

      {/* Completion Modal */}
      <StackCompletedModal
        isOpen={completedModalOpen}
        onClose={() => setCompletedModalOpen(false)}
        onReset={handleReset}
        stackName={getIndustryDisplayName()} // Use the formatted industry name
        stocksCount={stocks.length}
      />
    </div>
  );
}