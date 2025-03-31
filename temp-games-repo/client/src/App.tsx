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
import LearnPage from "@/pages/learn";
import MarketAdventure from "@/pages/market-adventure";
import InvestorSimulator from "@/pages/investor-simulator";
import { TimeAttackGame } from "@/components/time-attack-game";
import { AuthProvider } from "@/hooks/use-auth";
import { UserProgressProvider } from "@/contexts/user-progress-context";
import { BoardRoomGame } from "@/components/board-room-game";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/stock/:stackId" component={StockDetailPage} />
      <Route path="/lesson/:stackId" component={LessonPage} />
      <Route path="/learn" component={LearnPage} />
      <Route path="/market-adventure" component={MarketAdventure} />
      <Route path="/investor-simulator" component={InvestorSimulator} />
      <Route path="/time-attack" component={TimeAttackGame} />
      <Route path="/learn/board-room" component={BoardRoomGame} />
      <Route path="/achievements" component={HomePage} />
      <Route path="/profile" component={HomePage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
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
