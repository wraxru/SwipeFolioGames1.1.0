import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import LessonPage from "@/pages/lesson-page";
import OnboardingPage from "@/pages/onboarding-page";
import StockDetailPage from "@/pages/stock-detail-page";
import PortfolioPage from "@/pages/portfolio-page";
import LeaderboardPage from "@/pages/leaderboard-page";
import { AuthProvider } from "@/hooks/use-auth";
import { UserProgressProvider } from "@/contexts/user-progress-context";
import { PortfolioProvider } from "@/contexts/portfolio-context";

function Router() {
  return (
    <PortfolioProvider>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/stock/:stackId" component={StockDetailPage} />
        <Route path="/lesson/:stackId" component={LessonPage} />
        <Route path="/learn" component={HomePage} />
        <Route path="/market" component={HomePage} />
        <Route path="/portfolio" component={PortfolioPage} />
        <Route path="/leaderboard" component={LeaderboardPage} />
        <Route path="/achievements" component={HomePage} />
        <Route path="/profile" component={HomePage} />
        <Route path="/onboarding" component={OnboardingPage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    </PortfolioProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProgressProvider>
          <Router />
          <Toaster />
        </UserProgressProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
