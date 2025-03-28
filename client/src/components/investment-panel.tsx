import { useContext } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Progress } from './ui/progress';
import { PortfolioContext } from '@/contexts/portfolio-context';

export default function InvestmentPanel() {
  const portfolio = useContext(PortfolioContext);

  if (!portfolio) {
    return (
      <div className="investment-panel rounded-xl bg-white border border-slate-200 shadow-md animate-pulse p-4 mb-6">
        <div className="h-6 bg-slate-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
        <div className="h-3 bg-slate-200 rounded-full w-full mb-3"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  const { holdings, cash, portfolioValue } = portfolio;

  return (
    <div className="investment-panel rounded-xl bg-white border border-slate-200 shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Your Portfolio</h2>
      <div className="text-sm text-slate-600 mb-4">
        Current Holdings: {holdings.length} stocks
      </div>
      <div className="flex justify-between text-sm">
        <span>Portfolio Value: ${portfolioValue.toFixed(2)}</span>
        <span>Cash: ${cash.toFixed(2)}</span>
      </div>
    </div>
  );
}