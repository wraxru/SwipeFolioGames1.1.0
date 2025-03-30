import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Brain, ChevronRight, Zap, TrendingUp, BarChart3, PieChart, Bot, Trophy } from "lucide-react";
import { Stack } from "@shared/schema";
import AppHeader from "@/components/app-header";
import AppNavigation from "@/components/app-navigation";
import CategoryChips from "@/components/category-chips";
import SectionHeader from "@/components/section-header";
import StacksExplorer from "@/components/stacks-explorer";

import { useAuth } from "@/hooks/use-auth";
import { useState, useContext, useRef, useEffect } from "react";
import HeroSection from "@/components/hero-section";
import ModernUserWelcome from "@/components/modern-user-welcome";
import PortfolioDashboard from "@/components/portfolio-dashboard";
import CompetitionTracker from "@/components/competition-tracker";
import { PortfolioContext, usePortfolio } from "@/contexts/portfolio-context";
import AIAssistant from "@/components/ui/ai-assistant";

// Animated gradient background for AI sections
const GradientBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="relative overflow-hidden rounded-xl">
    {/* Animated gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-blue-500/20 to-purple-600/20 animate-gradient-slow rounded-xl" />
    
    {/* Subtle animated particles */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white opacity-40"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${6 + Math.random() * 5}s infinite ease-in-out ${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
    
    {/* Content */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

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

// AI Feature Card for the AI Hub
const AIFeatureCard = ({ 
  icon, 
  title, 
  description, 
  link 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  link: string;
}) => (
  <motion.a
    href={link}
    className="flex-shrink-0 w-48 p-3 bg-white/90 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="w-10 h-10 mb-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
      {icon}
    </div>
    <h3 className="font-semibold text-sm text-slate-800 mb-1">{title}</h3>
    <p className="text-xs text-slate-500">{description}</p>
  </motion.a>
);

export default function HomePage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Trending");
  
  // Ref for the AI Hub scrolling container
  const aiHubScrollRef = useRef<HTMLDivElement>(null);
  
  const { data: stacks, isLoading: isLoadingStacks } = useQuery<Stack[]>({
    queryKey: ["/api/stacks"],
  });
  
  const filterStacksByCategory = (stacks: Stack[], category: string) => {
    if (category === "Trending") {
      return stacks;
    }
    return stacks.filter(stack => stack.industry.includes(category));
  };

  // Add scroll shadow effect for AI hub
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);

  const handleScroll = () => {
    if (aiHubScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = aiHubScrollRef.current;
      setShowLeftShadow(scrollLeft > 10);
      setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = aiHubScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  return (
    <>
      <AppHeader />
      
      <main className="main-content pb-24 pt-20 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
        <AnimatedContainer>
          <HeroSection />
          <ModernUserWelcome name="Belford&Co" rank={11} />
          <CompetitionTracker />
        </AnimatedContainer>
        
        <AnimatedContainer delay={0.15}>
          <div className="md:grid md:grid-cols-1 md:gap-4">
            <PortfolioDashboard />
          </div>
        </AnimatedContainer>
        
        {/* AI Hub - Expanded, Modern Section */}
        <AnimatedContainer delay={0.25}>
          <GradientBackground>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-800 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1.5 text-purple-500" />
                  AI Hub
                </h2>
                <a href="/portfolio" className="text-xs text-blue-600 font-medium flex items-center">
                  View All
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
              
              {/* Scrollable AI tools cards with shadows */}
              <div className="relative">
                {showLeftShadow && (
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                )}
                
                <div 
                  className="flex space-x-3 py-2 overflow-x-auto scrollbar-hide scroll-smooth"
                  ref={aiHubScrollRef}
                >
                  <AIFeatureCard 
                    icon={<Brain className="w-5 h-5" />}
                    title="Portfolio Analyzer"
                    description="Get instant insights on your investments"
                    link="/portfolio"
                  />
                  
                  <AIFeatureCard 
                    icon={<Zap className="w-5 h-5" />}
                    title="Performance Booster"
                    description="AI recommendations to maximize returns"
                    link="/portfolio"
                  />
                  
                  <AIFeatureCard 
                    icon={<TrendingUp className="w-5 h-5" />}
                    title="Growth Predictor"
                    description="See potential future performance"
                    link="/portfolio"
                  />
                  
                  <AIFeatureCard 
                    icon={<BarChart3 className="w-5 h-5" />}
                    title="Market Insights"
                    description="AI-powered market trend analysis"
                    link="/markets"
                  />
                  
                  <AIFeatureCard 
                    icon={<PieChart className="w-5 h-5" />}
                    title="Diversification Helper"
                    description="Balance your portfolio optimally"
                    link="/portfolio"
                  />
                </div>
                
                {showRightShadow && (
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                )}
              </div>
            </div>
          </GradientBackground>
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
      
      
      <AIAssistant />
      <AppNavigation />
    </>
  );
}