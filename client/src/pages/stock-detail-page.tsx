import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@shared/schema";
import { ArrowLeft, Star, Info } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";

type TimeFrame = "1D" | "5D" | "1M" | "6M" | "YTD" | "1Y" | "5Y" | "MAX";

interface StockDetailProps {
  stackId: number;
}

export default function StockDetailPage() {
  const { stackId } = useParams<{ stackId: string }>();
  const [_, setLocation] = useLocation();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1M");

  // Fetch stack data
  const { data: stack, isLoading } = useQuery<Stack>({
    queryKey: [`/api/stacks/${stackId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!stackId,
  });

  // Mock stock data
  const stockData = {
    name: "Apple Inc.",
    ticker: "AAPL",
    price: 145.30,
    change: 1.25,
    rating: 4.5,
    smartScore: "High",
    description: "Global tech giant known for its integrated ecosystem of hardware, software, and services",
    metrics: {
      performance: { value: "Strong", color: "green" },
      stability: { value: "High", color: "green" },
      value: { value: "Fair", color: "yellow" },
      momentum: { value: "Strong", color: "green" },
    },
    synopsis: {
      price: "Rising on strong earnings and China iPhone sales",
      company: "New OpenAI partnership to boost AI efforts",
      role: "Anchor stock for stability and moderate growth"
    }
  };

  // Mock chart data points (more realistic fluctuating data)
  const generateChartData = () => {
    const points = [];
    let value = 140;
    
    for (let i = 0; i < 20; i++) {
      // Add some randomness to create a more realistic chart
      value += (Math.random() - 0.5) * 5;
      points.push(value);
    }
    
    return points;
  };
  
  const chartData = generateChartData();
  const minValue = Math.min(...chartData) - 2;
  const maxValue = Math.max(...chartData) + 2;

  // Handle back button click
  const handleBack = () => {
    setLocation("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <button 
          onClick={handleBack}
          className="text-cyan-400"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-cyan-400">Swipefolio</h1>
        <div className="w-6 h-6 relative">
          <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-full"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
        </div>
      </header>

      {/* Time Frame Selector */}
      <div className="flex justify-between px-4 py-2 border-b border-gray-800">
        {["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"].map((period) => (
          <button
            key={period}
            className={`px-2 py-1 ${
              timeFrame === period 
                ? "text-cyan-400 font-bold border-b-2 border-cyan-400" 
                : "text-gray-400"
            }`}
            onClick={() => setTimeFrame(period as TimeFrame)}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="px-2 pt-6 pb-2 border-b border-gray-800 h-44 relative">
        <svg viewBox="0 0 300 80" width="100%" height="100%" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
            </linearGradient>
          </defs>
          
          {/* Line chart */}
          <path
            d={`M 0,${80 - ((chartData[0] - minValue) / (maxValue - minValue)) * 80} ${chartData.map((point, i) => {
              const x = (i / (chartData.length - 1)) * 300;
              const y = 80 - ((point - minValue) / (maxValue - minValue)) * 80;
              return `L ${x},${y}`;
            }).join(" ")}`}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
          />
          
          {/* Area fill */}
          <path
            d={`M 0,${80 - ((chartData[0] - minValue) / (maxValue - minValue)) * 80} ${chartData.map((point, i) => {
              const x = (i / (chartData.length - 1)) * 300;
              const y = 80 - ((point - minValue) / (maxValue - minValue)) * 80;
              return `L ${x},${y}`;
            }).join(" ")} L 300,80 L 0,80 Z`}
            fill="url(#chartGradient)"
          />
        </svg>
        
        {/* Time scale */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>6:00</span>
          <span>10:00</span>
          <span>14:00</span>
          <span>18:00</span>
          <span>22:00</span>
          <span>2:00</span>
        </div>
      </div>

      {/* Stock Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{stockData.name} ({stockData.ticker})</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-semibold">${stockData.price.toFixed(2)}</span>
              <span className={`text-sm ${stockData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ({stockData.change >= 0 ? '+' : ''}{stockData.change}%)
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${
                    star <= Math.floor(stockData.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : star <= stockData.rating
                      ? "text-yellow-400 fill-yellow-400 opacity-50"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400 mt-1">SmartScore {stockData.smartScore}</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {stockData.description}
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-3 p-4 border-b border-gray-800">
        {Object.entries(stockData.metrics).map(([key, { value, color }]) => (
          <div 
            key={key}
            className={`p-3 rounded-md relative ${
              color === 'green' ? 'bg-green-900/30' :
              color === 'yellow' ? 'bg-yellow-900/30' : 
              'bg-red-900/30'
            }`}
          >
            <div className="absolute top-2 right-2">
              <Info size={16} className="text-white/60" />
            </div>
            <div 
              className={`font-bold ${
                color === 'green' ? 'text-green-500' :
                color === 'yellow' ? 'text-yellow-500' : 
                'text-red-500'
              }`}
            >
              {value}
            </div>
            <div className="text-white text-sm capitalize">{key}</div>
          </div>
        ))}
      </div>

      {/* Stock Synopsis */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-3">Stock Synopsis</h3>
        <div className="space-y-4">
          {/* Price */}
          <div className="flex gap-3">
            <div className="text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <div className="font-semibold">Price</div>
              <div className="text-sm text-gray-400">{stockData.synopsis.price}</div>
            </div>
          </div>
          
          {/* Company */}
          <div className="flex gap-3">
            <div className="text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                <path d="M9 22v-4h6v4" />
                <path d="M8 6h.01" />
                <path d="M16 6h.01" />
                <path d="M12 6h.01" />
                <path d="M12 10h.01" />
                <path d="M12 14h.01" />
                <path d="M16 10h.01" />
                <path d="M16 14h.01" />
                <path d="M8 10h.01" />
                <path d="M8 14h.01" />
              </svg>
            </div>
            <div>
              <div className="font-semibold">Company</div>
              <div className="text-sm text-gray-400">{stockData.synopsis.company}</div>
            </div>
          </div>
          
          {/* Role */}
          <div className="flex gap-3">
            <div className="text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
                <path d="M16.5 16 15 20h-6l-1.5-4" />
              </svg>
            </div>
            <div>
              <div className="font-semibold">Role</div>
              <div className="text-sm text-gray-400">{stockData.synopsis.role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}