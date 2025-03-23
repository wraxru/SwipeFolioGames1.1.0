import { useState } from "react";

interface CategoryChipsProps {
  onCategoryChange?: (category: string) => void;
}

export default function CategoryChips({ onCategoryChange }: CategoryChipsProps) {
  const [activeCategory, setActiveCategory] = useState("Trending");
  
  const categories = ["Trending", "Stocks", "Crypto", "ETFs", "Alternatives"];
  
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };
  
  return (
    <div className="flex overflow-x-auto py-4 space-x-3 no-scrollbar">
      {categories.map(category => (
        <button
          key={category}
          className={`category-chip whitespace-nowrap ${activeCategory === category ? 'active' : ''}`}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}