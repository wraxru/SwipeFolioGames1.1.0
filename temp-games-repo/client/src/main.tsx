import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { PortfolioProvider } from "@/contexts/portfolio-context";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <PortfolioProvider>
      <App />
      <Toaster />
    </PortfolioProvider>
  </QueryClientProvider>
);
