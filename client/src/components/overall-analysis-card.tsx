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
    if (rating >= 8) return "bg-green-900/30";
    if (rating >= 6) return "bg-cyan-900/30";
    if (rating >= 4) return "bg-yellow-900/30";
    return "bg-red-900/30";
  };

  const getRatingBorder = (rating: number) => {
    if (rating >= 8) return "border-green-500/40";
    if (rating >= 6) return "border-cyan-500/40";
    if (rating >= 4) return "border-yellow-500/40";
    return "border-red-500/40";
  };

  const getRatingGradient = (rating: number) => {
    if (rating >= 8) return "from-green-900/40 to-green-950/10";
    if (rating >= 6) return "from-cyan-900/40 to-cyan-950/10";
    if (rating >= 4) return "from-yellow-900/40 to-yellow-950/10";
    return "from-red-900/40 to-red-950/10";
  };

  const getRatingText = (rating: number) => {
    if (rating >= 8) return "Strong";
    if (rating >= 6) return "Good";
    if (rating >= 4) return "Fair";
    return "Weak";
  };

  // Get appropriate icon based on rating
  const RatingIcon = () => {
    if (rating >= 8) return <TrendingUp className={cn("w-5 h-5", getRatingColor(rating), "drop-shadow-md")} />;
    if (rating >= 6) return <ChartBar className={cn("w-5 h-5", getRatingColor(rating), "drop-shadow-md")} />;
    if (rating >= 4) return <LineChart className={cn("w-5 h-5", getRatingColor(rating), "drop-shadow-md")} />;
    return <Lightbulb className={cn("w-5 h-5", getRatingColor(rating), "drop-shadow-md")} />;
  };

  return (
    <Card 
      className="border-gray-700/50 bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl overflow-hidden"
      style={{
        boxShadow: rating >= 8 ? '0 0 20px rgba(34, 197, 94, 0.05)' :
                  rating >= 6 ? '0 0 20px rgba(6, 182, 212, 0.05)' :
                  rating >= 4 ? '0 0 20px rgba(234, 179, 8, 0.05)' :
                  '0 0 20px rgba(239, 68, 68, 0.05)'
      }}
    >
      <CardHeader className="pb-2 border-b border-gray-800">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-white drop-shadow-sm">
          <div className={cn(
            "flex items-center justify-center p-1.5 rounded-full bg-gradient-to-br", 
            getRatingGradient(rating),
            "border",
            getRatingBorder(rating),
            "shadow-lg"
          )}>
            <RatingIcon />
          </div>
          Overall Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4 flex items-center gap-3">
          <div className={cn(
            "text-sm px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 shadow-md",
            "bg-gradient-to-r",
            getRatingGradient(rating),
            getRatingColor(rating),
            "border",
            getRatingBorder(rating)
          )}>
            <RatingIcon />
            <span className="drop-shadow-sm">{getRatingText(rating)} ({rating}/10)</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Company identification */}
          <h3 className="font-bold text-lg text-white drop-shadow-sm">{name} <span className="text-gray-400">({ticker})</span></h3>
          
          {/* Analysis paragraph - styled with a container */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 p-4 rounded-xl border border-gray-700/50 shadow-inner">
            <p className="text-gray-300 text-sm leading-relaxed">{analysis}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}