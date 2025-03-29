import React, { useState } from "react";
import { ChartBar, Lightbulb, LineChart, TrendingUp, Send, Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { StockData } from "@/lib/stock-data";

interface OverallAnalysisCardProps {
  stock: StockData;
}

export default function OverallAnalysisCard({ stock }: OverallAnalysisCardProps) {
  const { ticker, name, rating, overallAnalysis } = stock;
  const analysis = overallAnalysis;
  
  // State for AI functionality
  const [userQuestion, setUserQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState<string | null>(null);
  
  // Handler for sending questions to the AI
  const handleSendStockQuestion = async () => {
    // Validate input
    if (!userQuestion.trim()) return;
    
    // Reset previous response and set loading state
    setAiResponse("");
    setErrorAI(null);
    setIsLoadingAI(true);
    
    try {
      // Create stock context object with relevant information
      const stockContext = {
        ticker: stock.ticker,
        name: stock.name,
        description: stock.description,
        price: stock.price,
        industry: stock.industry,
        metrics: {
          performance: stock.metrics.performance.value,
          stability: stock.metrics.stability.value,
          value: stock.metrics.value.value,
          momentum: stock.metrics.momentum.value
        }
      };
      
      // Send request to backend
      const response = await fetch('/api/ai/ask-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userQuestion, stockContext }),
      });
      
      // Handle the response
      if (response.ok) {
        const data = await response.json();
        if (data.answer) {
          setAiResponse(data.answer);
        } else {
          setErrorAI("Received invalid response from server");
        }
      } else {
        const errorData = await response.json();
        setErrorAI(errorData.message || "Failed to get AI response");
      }
    } catch (error) {
      setErrorAI("Error connecting to AI service. Please try again.");
      console.error("AI request error:", error);
    } finally {
      setIsLoadingAI(false);
    }
  };
  // Calculate rating color and style based on the numeric rating (1-10)
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-600";
    if (rating >= 6) return "text-sky-600";
    if (rating >= 4) return "text-amber-600";
    return "text-red-600";
  };

  const getRatingBackground = (rating: number) => {
    if (rating >= 8) return "bg-green-50";
    if (rating >= 6) return "bg-sky-50";
    if (rating >= 4) return "bg-amber-50";
    return "bg-red-50";
  };

  const getRatingBorder = (rating: number) => {
    if (rating >= 8) return "border-green-200";
    if (rating >= 6) return "border-sky-200";
    if (rating >= 4) return "border-amber-200";
    return "border-red-200";
  };

  const getRatingGradient = (rating: number) => {
    if (rating >= 8) return "from-green-50 to-white";
    if (rating >= 6) return "from-sky-50 to-white";
    if (rating >= 4) return "from-amber-50 to-white";
    return "from-red-50 to-white";
  };

  const getRatingText = (rating: number) => {
    if (rating >= 8) return "Strong";
    if (rating >= 6) return "Good";
    if (rating >= 4) return "Fair";
    return "Weak";
  };

  // Get appropriate icon based on rating
  const RatingIcon = () => {
    if (rating >= 8) return <TrendingUp className={cn("w-5 h-5", getRatingColor(rating))} />;
    if (rating >= 6) return <ChartBar className={cn("w-5 h-5", getRatingColor(rating))} />;
    if (rating >= 4) return <LineChart className={cn("w-5 h-5", getRatingColor(rating))} />;
    return <Lightbulb className={cn("w-5 h-5", getRatingColor(rating))} />;
  };

  return (
    <div className="relative">
      {/* Add shadow effect behind the card */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-xl blur-md transform scale-[0.98] translate-y-1"></div>
      
      <Card 
        className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-lg relative z-10"
      >
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          rating >= 8 ? 'bg-gradient-to-r from-green-400 to-green-600' :
          rating >= 6 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
          rating >= 4 ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
          'bg-gradient-to-r from-red-400 to-red-600'
        }`}></div>
        
        <CardHeader className="py-4 px-5 bg-gradient-to-b from-white to-slate-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-1.5 rounded-lg mr-1 shadow-sm">
                <LineChart className="w-5 h-5" />
              </div>
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Analysis Overview
              </span>
            </CardTitle>
            
            <div className={cn(
              "text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1.5 shadow-sm",
              "text-white",
              rating >= 8 ? 'bg-gradient-to-r from-green-500 to-green-600' :
              rating >= 6 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
              rating >= 4 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
              'bg-gradient-to-r from-red-500 to-red-600'
            )}>
              <RatingIcon />
              <span>{getRatingText(rating)} ({rating}/10)</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-3 px-5 pb-5">
          <div className="space-y-4">          
            {/* Analysis paragraph - enhanced styling */}
            <div className="relative group transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-100/30 to-gray-100/30 rounded-xl blur-sm transform scale-[0.98] translate-y-1 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 relative z-10 overflow-hidden group-hover:border-slate-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 to-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-slate-50 via-blue-50 to-transparent rounded-full opacity-70"></div>
                <p className="text-slate-700 text-sm leading-relaxed relative z-10">
                  {analysis}
                </p>
              </div>
            </div>
            
            {/* Ask AI section */}
            <div className="relative group transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-cyan-100/30 rounded-xl blur-sm transform scale-[0.98] translate-y-1 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 relative z-10 overflow-hidden group-hover:border-blue-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3 items-start">
                    <div className="text-white bg-gradient-to-br from-blue-400 to-blue-600 w-10 h-10 min-w-10 flex items-center justify-center rounded-lg shadow-md">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base text-slate-800 mb-1">Ask AI about {ticker}</h4>
                      
                      {/* AI Question Input */}
                      <div className="relative">
                        <Textarea 
                          placeholder={`Ask about ${ticker}...`}
                          value={userQuestion}
                          onChange={(e) => setUserQuestion(e.target.value)}
                          className="min-h-[60px] text-slate-900 text-sm border-slate-300 focus:border-blue-300 resize-none mb-2"
                        />
                        <Button
                          size="sm"
                          onClick={handleSendStockQuestion}
                          disabled={isLoadingAI || !userQuestion.trim()}
                          className="mt-1 mb-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                        >
                          {isLoadingAI ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {/* AI Response */}
                      {aiResponse && (
                        <div className="bg-blue-50 p-3 rounded-lg mt-2 border border-blue-100">
                          <p className="text-sm text-slate-800 leading-relaxed">{aiResponse}</p>
                        </div>
                      )}
                      
                      {/* Error Message */}
                      {errorAI && (
                        <div className="bg-red-50 p-3 rounded-lg mt-2 border border-red-100">
                          <p className="text-sm text-red-600">{errorAI}</p>
                        </div>
                      )}
                      
                      {/* Disclaimer */}
                      <p className="text-xs text-slate-500 mt-2 italic">
                        AI responses are for educational purposes only and are not financial advice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}