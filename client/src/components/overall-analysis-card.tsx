import React from 'react';
import { Star, TrendingUp, BarChart3, LineChart, Activity, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface OverallAnalysisCardProps {
  ticker: string;
  name: string;
  rating: number;
  analysis: string;
}

const getGlowColor = (rating: number) => {
  if (rating >= 8) return '#0af'; // Cyan for high ratings
  if (rating >= 6) return '#5ae'; // Blue for good ratings
  if (rating >= 4) return '#fa0'; // Yellow for average ratings
  return '#f56'; // Red for low ratings
};

const getIcon = (rating: number) => {
  if (rating >= 8) return <Award className="h-6 w-6" />;
  if (rating >= 6) return <TrendingUp className="h-6 w-6" />;
  if (rating >= 4) return <LineChart className="h-6 w-6" />;
  return <BarChart3 className="h-6 w-6" />;
};

export default function OverallAnalysisCard({ ticker, name, rating, analysis }: OverallAnalysisCardProps) {
  const glowColor = getGlowColor(rating);
  const icon = getIcon(rating);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-5 rounded-xl overflow-hidden border border-gray-800"
      style={{
        background: `linear-gradient(180deg, rgba(20, 20, 30, 0.8) 0%, rgba(15, 15, 25, 0.8) 100%)`,
        boxShadow: `0 0 15px 0 ${glowColor}20`
      }}
    >
      <div 
        className="p-4 border-b border-gray-800" 
        style={{ 
          background: `linear-gradient(90deg, ${glowColor}10 0%, transparent 100%)`,
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div 
              className="p-2.5 rounded-full mr-3 flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${glowColor}30 0%, transparent 100%)`,
                border: `1px solid ${glowColor}40` 
              }}
            >
              {React.cloneElement(icon, { className: `h-5 w-5 text-${glowColor}` })}
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">{name} ({ticker})</h3>
              <div className="flex items-center text-sm text-gray-400">
                Overall Analysis
                <div className="ml-2 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3.5 w-3.5 ${i < Math.round(rating/2) ? `text-${glowColor}` : 'text-gray-600'}`} 
                      fill={i < Math.round(rating/2) ? glowColor : 'transparent'}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div 
            className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg"
            style={{ 
              background: `linear-gradient(135deg, ${glowColor}40 0%, ${glowColor}20 100%)`,
              border: `2px solid ${glowColor}60` 
            }}
          >
            {rating}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-300 leading-relaxed text-sm">{analysis}</p>
      </div>
    </motion.div>
  );
}