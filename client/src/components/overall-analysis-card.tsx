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
    <Card 
      className="border border-slate-100 bg-white rounded-xl shadow-sm overflow-hidden"
      style={{
        boxShadow: rating >= 8 ? '0 0 15px rgba(34, 197, 94, 0.03)' :
                  rating >= 6 ? '0 0 15px rgba(6, 182, 212, 0.03)' :
                  rating >= 4 ? '0 0 15px rgba(234, 179, 8, 0.03)' :
                  '0 0 15px rgba(239, 68, 68, 0.03)'
      }}
    >
      <CardHeader className="pb-2 border-b border-slate-100">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
          <div className={cn(
            "flex items-center justify-center p-1.5 rounded-full bg-gradient-to-br", 
            getRatingGradient(rating),
            "border",
            getRatingBorder(rating),
            "shadow-sm"
          )}>
            <RatingIcon />
          </div>
          Overall Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4 flex items-center gap-3">
          <div className={cn(
            "text-sm px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 shadow-sm",
            "bg-gradient-to-r",
            getRatingGradient(rating),
            getRatingColor(rating),
            "border",
            getRatingBorder(rating)
          )}>
            <RatingIcon />
            <span>{getRatingText(rating)} ({rating}/10)</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Company identification */}
          <h3 className="font-bold text-lg text-slate-800">{name} <span className="text-slate-500">({ticker})</span></h3>
          
          {/* Analysis paragraph - styled with a container */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-slate-600 text-sm leading-relaxed">{analysis}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}