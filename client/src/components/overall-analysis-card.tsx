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
      className="border border-slate-100 bg-white rounded-lg overflow-hidden"
    >
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
            Analysis Overview
          </CardTitle>
          
          <div className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1",
            getRatingColor(rating),
            "border",
            getRatingBorder(rating),
            getRatingBackground(rating)
          )}>
            <RatingIcon />
            <span>{getRatingText(rating)} ({rating}/10)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <div className="space-y-3">          
          {/* Analysis paragraph - minimalist styling */}
          <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
            <p className="text-slate-600 text-xs leading-relaxed">{analysis}</p>
          </div>
          
          {/* Key Insight box - new Robinhood-style feature */}
          <div className="mt-3 bg-sky-50/50 p-3 rounded-lg border border-sky-100">
            <div className="flex gap-2 items-start">
              <div className="text-sky-500 bg-sky-50 border border-sky-100 w-8 h-8 min-w-8 flex items-center justify-center rounded-full">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-medium text-slate-800 mb-1">Key Insight</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {name} is currently rated {getRatingText(rating).toLowerCase()} based on financial performance, market conditions, and growth potential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}