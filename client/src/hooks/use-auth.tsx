import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Extended user type with rank information for the UI
export interface ExtendedUser extends SelectUser {
  rank: number;
  previousRank: number;
}

type AuthContextType = {
  user: ExtendedUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<ExtendedUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<ExtendedUser, Error, InsertUser>;
  updateOnboardingMutation: UseMutationResult<ExtendedUser, Error, OnboardingData>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

type OnboardingData = {
  experienceLevel: string;
  interests: string[];
  dailyGoal: number;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // Mock user for testing purposes with added rank information
  const mockUser: ExtendedUser = {
    id: 1,
    username: "investorpro",
    password: "",
    displayName: "Alex Investor",
    xp: 750,
    streakCount: 5,
    lastActive: new Date(),
    level: 3,
    dailyGoal: 5,
    interests: ["Tech", "Crypto", "ETFs"],
    experienceLevel: "intermediate",
    onboarded: true,
    // Added rank information
    rank: 42,
    previousRank: 45
  };
  
  // Use mock user instead of API call
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<ExtendedUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: () => Promise.resolve(mockUser),
    // queryFn: getQueryFn({ on401: "returnNull" }), // Original API call
  });

  const loginMutation = useMutation<ExtendedUser, Error, LoginData>({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      const user = await res.json();
      // Add rank info to returned user data
      return { ...user, rank: 42, previousRank: 45 };
    },
    onSuccess: (user: any) => {
      // Add rank information for UI if not present
      const extendedUser: ExtendedUser = {
        ...user,
        rank: user.rank || 42,
        previousRank: user.previousRank || 45
      };
      queryClient.setQueryData(["/api/user"], extendedUser);
      toast({
        title: "Login successful",
        description: `Welcome back, ${extendedUser.displayName}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation<ExtendedUser, Error, InsertUser>({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      const user = await res.json();
      // Add rank info to returned user data
      return { ...user, rank: 42, previousRank: 45 };
    },
    onSuccess: (user: any) => {
      // Add rank information for UI if not present
      const extendedUser: ExtendedUser = {
        ...user,
        rank: user.rank || 42,
        previousRank: user.previousRank || 45
      };
      queryClient.setQueryData(["/api/user"], extendedUser);
      toast({
        title: "Registration successful",
        description: `Welcome to Swipefolio, ${extendedUser.displayName}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Username already exists",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const updateOnboardingMutation = useMutation<ExtendedUser, Error, OnboardingData>({
    mutationFn: async (data: OnboardingData) => {
      const res = await apiRequest("PATCH", "/api/user/onboarding", data);
      const user = await res.json();
      // Add rank info to returned user data
      return { ...user, rank: 42, previousRank: 45 };
    },
    onSuccess: (user: any) => {
      // Add rank information for UI if not present
      const extendedUser: ExtendedUser = {
        ...user,
        rank: user.rank || 42,
        previousRank: user.previousRank || 45
      };
      queryClient.setQueryData(["/api/user"], extendedUser);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update preferences",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        updateOnboardingMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
