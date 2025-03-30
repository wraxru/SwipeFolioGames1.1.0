import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Stack } from "@shared/schema";
import AppHeader from "@/components/app-header";
import AppNavigation from "@/components/app-navigation";
import CategoryChips from "@/components/category-chips";
import SectionHeader from "@/components/section-header";
import StacksExplorer from "@/components/stacks-explorer";

import { useAuth } from "@/hooks/use-auth";
import { useState, useContext } from "react";
import HeroSection from "@/components/hero-section";
import ModernUserWelcome from "@/components/modern-user-welcome";
import PortfolioDashboard from "@/components/portfolio-dashboard";
import CompetitionTracker from "@/components/competition-tracker";
import { PortfolioContext, usePortfolio } from "@/contexts/portfolio-context";

// Container for applying animations to child elements
const AnimatedContainer = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
);

export default function HomePage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Trending");
  
  const { data: stacks, isLoading: isLoadingStacks } = useQuery<Stack[]>({
    queryKey: ["/api/stacks"],
  });
  
  const filterStacksByCategory = (stacks: Stack[], category: string) => {
    if (category === "Trending") {
      return stacks;
    }
    return stacks.filter(stack => stack.industry.includes(category));
  };
  
  return (
    <>
      <AppHeader />
      
      <main className="main-content pb-24 pt-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <AnimatedContainer>
          <HeroSection />
          <ModernUserWelcome name="Belford&Co" rank={11} />
        </AnimatedContainer>
        
        <AnimatedContainer delay={0.2}>
          <div className="md:grid md:grid-cols-2 md:gap-4">
            <PortfolioDashboard />
            <CompetitionTracker />
          </div>
        </AnimatedContainer>
        
        {/* AI Portfolio Advisor Banner - More Sleek & Compact */}
        <AnimatedContainer delay={0.25}>
          <motion.div 
            className="rounded-lg border border-blue-100 bg-white p-3 my-3 shadow-sm flex items-center justify-between"
            whileHover={{ y: -2, boxShadow: "0 4px 12px -2px rgba(59, 130, 246, 0.1)" }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                <span className="text-sm">✨</span>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 text-sm flex items-center">
                  Get AI insights for your portfolio
                </h3>
                <p className="text-slate-500 text-xs">
                  Smart suggestions to improve performance
                </p>
              </div>
            </div>
            
            <motion.a 
              href="/portfolio"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try AI
            </motion.a>
          </motion.div>
        </AnimatedContainer>
        
        <AnimatedContainer delay={0.3}>
          <CategoryChips 
            onCategoryChange={setSelectedCategory}
          />
        </AnimatedContainer>
        
        <AnimatedContainer delay={0.4}>
          <SectionHeader 
            title="Popular Picks" 
          />
          
          {isLoadingStacks ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : stacks ? (
            <StacksExplorer 
              stacks={filterStacksByCategory(stacks, selectedCategory)}
            />
          ) : (
            <div className="text-center py-12 text-gray-400">
              No stacks available
            </div>
          )}
        </AnimatedContainer>
      </main>
      
      <AppNavigation />
    </>
  );
}