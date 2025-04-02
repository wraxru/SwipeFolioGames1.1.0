import React from 'react';
import { FaLaptopCode, FaIndustry, FaHandshake, FaBolt, FaChartLine } from 'react-icons/fa';

interface SectorProps {
  name: string;
  performance: number;
  icon: React.ReactNode;
}

interface SectorFocusProps {
  onSectorSelect: (sector: string) => void;
}

const sectors: SectorProps[] = [
  { name: 'Technology', performance: 110, icon: <FaLaptopCode className="text-blue-500" /> },
  { name: 'Manufacturing', performance: 95, icon: <FaIndustry className="text-yellow-500" /> },
  { name: 'Services', performance: 105, icon: <FaHandshake className="text-green-500" /> },
  { name: 'Energy', performance: 100, icon: <FaBolt className="text-orange-500" /> },
  { name: 'Finance', performance: 108, icon: <FaChartLine className="text-purple-500" /> },
];

export default function SectorFocus({ onSectorSelect }: SectorFocusProps) {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold mb-4">Step 1: Choose Sector Focus</h2>
      <p className="text-gray-600 mb-4">Select one sector to prioritize this turn</p>
      
      <div className="space-y-3">
        {sectors.map((sector) => (
          <button
            key={sector.name}
            onClick={() => onSectorSelect(sector.name)}
            className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{sector.icon}</div>
              <span className="font-medium">{sector.name}</span>
            </div>
            <div className={`font-semibold ${
              sector.performance > 100 ? 'text-green-500' : 
              sector.performance < 100 ? 'text-red-500' : 
              'text-gray-500'
            }`}>
              {sector.performance}%
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 