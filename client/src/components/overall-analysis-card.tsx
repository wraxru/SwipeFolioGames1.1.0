import React from "react";
import { ChartBar, Lightbulb, LineChart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OverallAnalysisCardProps {
  ticker: string;
  name: string;
  rating: number;
  analysis: string;
}

export default function OverallAnalysisCard({ ticker, name, rating, analysis }: OverallAnalysisCardProps) {
  // Calculate rating color and style based on the numeric rating (1-10)
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-400";
    if (rating >= 6) return "text-cyan-400";
    if (rating >= 4) return "text-yellow-400";
    return "text-red-400";
  };

  const getRatingBackground = (rating: number) => {
    if (rating >= 8) return "bg-green-900/20";
    if (rating >= 6) return "bg-cyan-900/20";
    if (rating >= 4) return "bg-yellow-900/20";
    return "bg-red-900/20";
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
    <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className={cn(
            "flex items-center justify-center p-1 rounded-full", 
            getRatingBackground(rating)
          )}>
            <RatingIcon />
          </div>
          Overall Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-3">
          <div className={cn(
            "text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1.5",
            getRatingBackground(rating), 
            getRatingColor(rating)
          )}>
            <RatingIcon />
            <span>{getRatingText(rating)} ({rating}/10)</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Company identification */}
          <h3 className="font-semibold text-lg text-white">{name} ({ticker})</h3>
          
          {/* Analysis paragraph */}
          <p className="text-gray-300 text-sm leading-relaxed">{analysis}</p>
        </div>
      </CardContent>
    </Card>
  );
}