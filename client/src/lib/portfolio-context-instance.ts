import { PortfolioContextProps } from '@/contexts/portfolio-context';

/**
 * This utility provides a way to access the PortfolioContext outside of React components
 * It's used by services that need to read the current portfolio state
 */
class PortfolioContextInstance {
  private context: PortfolioContextProps | null = null;

  setContext(context: PortfolioContextProps): void {
    this.context = context;
  }

  getContext(): PortfolioContextProps | null {
    return this.context;
  }
}

// Create a singleton instance
export const portfolioContextInstance = new PortfolioContextInstance();