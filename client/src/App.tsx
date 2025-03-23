import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import LessonPage from "@/pages/lesson-page";
import OnboardingPage from "@/pages/onboarding-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { UserProgressProvider } from "@/contexts/user-progress-context";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/lesson/:stackId" component={LessonPage} />
      <ProtectedRoute path="/onboarding" component={OnboardingPage} />
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
