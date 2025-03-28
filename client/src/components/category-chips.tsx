import { useState } from "react";
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Database, DollarSign, Gem } from 'lucide-react';

interface CategoryChipsProps {
  onCategoryChange?: (category: string) => void;
}

export default function CategoryChips({ onCategoryChange }: CategoryChipsProps) {
  const [activeCategory, setActiveCategory] = useState("Trending");
  
  const categories = [
    { id: "Trending", label: "Trending", icon: <TrendingUp size={16} /> },
    { id: "Stocks", label: "Stocks", icon: <BarChart3 size={16} /> },
    { id: "Crypto", label: "Crypto", icon: <Database size={16} /> },
    { id: "ETFs", label: "ETFs", icon: <DollarSign size={16} /> },
    { id: "Alternatives", label: "Alternatives", icon: <Gem size={16} /> },
  ];
  
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };
  
  return (
    <div className="flex overflow-x-auto py-4 space-x-3 no-scrollbar relative">
      {/* Background line */}
      <div className="absolute h-0.5 bg-gray-100 bottom-[18px] left-0 right-0 z-0" />
      
      <div className="flex space-x-3">
        {categories.map(category => (
          <motion.button
            key={category.id}
            className={`relative flex items-center py-1.5 px-4 rounded-full whitespace-nowrap transition-all duration-200 ${
              activeCategory === category.id 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => handleCategoryClick(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-1.5">{category.icon}</span>
            <span className="font-medium text-sm">{category.label}</span>
            
            {activeCategory === category.id && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 bg-blue-500 rounded-full -z-10"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}