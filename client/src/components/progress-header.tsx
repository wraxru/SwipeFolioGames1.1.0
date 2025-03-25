import { Award, DollarSign } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { usePortfolio } from "@/contexts/portfolio-context";
import { motion } from "framer-motion";

interface ProgressHeaderProps {
  streakCount: number;
  xp: number;
  isLoading?: boolean;
}

export default function ProgressHeader({ streakCount, xp, isLoading = false }: ProgressHeaderProps) {
  // Get portfolio data (cash, holdings) from context
  const { cash, portfolioValue, totalValue } = usePortfolio();
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  if (isLoading) {
    return (
      <div className="progress-stats flex space-x-4 my-5">
        <div className="flex-1 bg-white rounded-xl p-3 flex items-center space-x-3 shadow-md border border-slate-100">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl p-3 flex items-center space-x-3 shadow-md border border-slate-100">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-stats flex space-x-4 my-5">
      <motion.div 
        className="flex-1 bg-white rounded-xl p-3 flex items-center space-x-3 shadow-md border border-slate-100"
        whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-inner">
          <DollarSign className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-slate-500">Available Cash</p>
          <p className="text-lg font-bold text-slate-800 flex items-center">
            <span className="tracking-tight">{formatCurrency(cash)}</span>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600"
            >
              Paper
            </motion.div>
          </p>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex-1 bg-white rounded-xl p-3 flex items-center space-x-3 shadow-md border border-slate-100"
        whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-inner">
          <Award className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-slate-500">Portfolio Value</p>
          <p className="text-lg font-bold text-slate-800">{formatCurrency(portfolioValue)}</p>
        </div>
      </motion.div>
    </div>
  );
}