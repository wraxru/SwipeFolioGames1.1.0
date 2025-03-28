import { useQuery } from "@tanstack/react-query";
import { Loader2, TrendingUp } from "lucide-react";
import { Stack } from "@shared/schema";
import AppHeader from "@/components/app-header";
import AppNavigation from "@/components/app-navigation";
import SearchBar from "@/components/search-bar";
import CategoryChips from "@/components/category-chips";
import SectionHeader from "@/components/section-header";
import StacksExplorer from "@/components/stacks-explorer";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { motion } from "framer-motion";

// Import our modernized components
import ModernUserWelcome from "@/components/modern-user-welcome";
import HeroSection from "@/components/hero-section";
import InvestmentPanel from "@/components/investment-panel";
import CompetitionTracker from "@/components/competition-tracker";

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
  
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <>
      <AppHeader />
      
      <main className="main-content px-4 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Modern user welcome component */}
          <ModernUserWelcome 
            name={user?.displayName || "Investor"} 
            rank={42}
            previousRank={45}
          />
          
          {/* Hero section with competition info */}
          <motion.div variants={itemVariants}>
            <HeroSection />
          </motion.div>
          
          {/* Investment panel showing portfolio allocation */}
          <motion.div variants={itemVariants}>
            <InvestmentPanel />
          </motion.div>
          
          {/* Competition tracker with daily goals */}
          <motion.div variants={itemVariants}>
            <CompetitionTracker />
          </motion.div>
          
          {/* Improved search */}
          <motion.div variants={itemVariants}>
            <SearchBar />
          </motion.div>
          
          {/* Enhanced category navigation */}
          <motion.div variants={itemVariants}>
            <div className="mt-2">
              <div className="flex items-center mb-1">
                <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                <h3 className="text-lg font-bold text-gray-800">Discover Assets</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">Find your next investment opportunity</p>
              <CategoryChips onCategoryChange={setSelectedCategory} />
            </div>
          </motion.div>
          
          {/* Stacks section */}
          <motion.div variants={itemVariants}>
            <SectionHeader 
              title="Premium Content" 
            />
            
            {isLoadingStacks ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : stacks ? (
              <StacksExplorer 
                stacks={filterStacksByCategory(stacks, selectedCategory)}
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                No content available
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
      
      <AppNavigation />
    </>
  );
}