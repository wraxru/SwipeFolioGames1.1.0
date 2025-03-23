import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Stack } from "@shared/schema";
import AppHeader from "@/components/app-header";
import AppNavigation from "@/components/app-navigation";
import UserWelcome from "@/components/user-welcome";
import SearchBar from "@/components/search-bar";
import CategoryChips from "@/components/category-chips";
import SectionHeader from "@/components/section-header";
import StacksExplorer from "@/components/stacks-explorer";
import DailyGoal from "@/components/daily-goal";
import ProgressHeader from "@/components/progress-header";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

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
      
      <main className="main-content">
        <UserWelcome name={user?.displayName || "Guest"} />
        
        <SearchBar />
        
        <ProgressHeader 
          streakCount={user?.streakCount || 0} 
          xp={user?.xp || 0}
          isLoading={false}
        />
        
        <DailyGoal
          dailyGoal={user?.dailyGoal || 3}
          completed={1}
          isLoading={false}
        />
        
        <CategoryChips 
          onCategoryChange={setSelectedCategory}
        />
        
        <SectionHeader 
          title="Popular Stacks" 
        />
        
        {isLoadingStacks ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
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
      </main>
      
      <AppNavigation />
    </>
  );
}