import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import AppNavigation from "@/components/app-navigation";
import { motion } from "framer-motion";

interface GameState {
  playerName: string;
  initialCapital: number;
  currentCapital: number;
  portfolio: Record<string, number>;
  dayCount: number;
  marketSentiment: string;
  riskTolerance: string;
  investmentStrategy: string;
  learnedBasics: boolean;
  firstTrade: boolean;
  marketKnowledge: number;
  tradingExperience: number;
  currentSector: string;
  lastTradeResult: string;
  tutorialCompleted: boolean;
}

export default function InvestorSimulator() {
  const [_, setLocation] = useLocation();
  const [gameState, setGameState] = useState<GameState>({
    playerName: "",
    initialCapital: 100000,
    currentCapital: 100000,
    portfolio: {},
    dayCount: 1,
    marketSentiment: "neutral",
    riskTolerance: "moderate",
    investmentStrategy: "none",
    learnedBasics: false,
    firstTrade: false,
    marketKnowledge: 0,
    tradingExperience: 0,
    currentSector: "none",
    lastTradeResult: "none",
    tutorialCompleted: false
  });

  const [currentScene, setCurrentScene] = useState("start");

  const renderScene = () => {
    switch (currentScene) {
      case "start":
        return (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-3xl font-bold mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              Welcome to Investor Simulator
            </motion.h1>
            <motion.p 
              className="text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              This interactive experience will help you learn about investing in the stock market through hands-on practice.
            </motion.p>
            <motion.p 
              className="text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              You have ${gameState.initialCapital.toLocaleString()} in initial capital to start your investment journey.
            </motion.p>
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => setCurrentScene("market_basics")}
                >
                  Learn Market Basics
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => setCurrentScene("first_trade")}
                >
                  Skip Tutorial & Start Trading
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        );

      case "market_basics":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Market Basics</h2>
            <div className="space-y-4 mb-6">
              <p className="text-gray-700">Let's start with the fundamentals of stock market investing:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Stocks represent ownership in a company</li>
                <li>Stock prices fluctuate based on:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Company performance</li>
                    <li>Market sentiment</li>
                    <li>Economic conditions</li>
                    <li>Industry trends</li>
                  </ul>
                </li>
                <li>Key concepts to remember:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Buy low, sell high</li>
                    <li>Diversification reduces risk</li>
                    <li>Research before investing</li>
                    <li>Don't invest more than you can afford to lose</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("investment_strategies")}
              >
                Learn Investment Strategies
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("first_trade")}
              >
                Start Trading
              </Button>
            </div>
          </div>
        );

      case "investment_strategies":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Investment Strategies</h2>
            <div className="space-y-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Growth Investing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Focus on companies with high growth potential</li>
                    <li>Often higher risk, higher reward</li>
                    <li>Example: Tech companies</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Value Investing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Look for undervalued companies</li>
                    <li>Often more stable, lower risk</li>
                    <li>Example: Established companies with strong fundamentals</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dividend Investing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Focus on companies that pay regular dividends</li>
                    <li>Provides steady income</li>
                    <li>Example: Utility companies</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Index Investing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Invest in market indices</li>
                    <li>Diversified, lower risk</li>
                    <li>Example: S&P 500 ETFs</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("first_trade")}
              >
                Start Trading
              </Button>
            </div>
          </div>
        );

      case "first_trade":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your First Trade</h2>
            <p className="text-gray-600 mb-6">
              You have ${gameState.currentCapital.toLocaleString()} to invest. The tech sector is showing strong growth potential.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("research_tech")}
              >
                Research Tech Companies
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("invest_tech_etf")}
              >
                Invest in Tech ETF
              </Button>
            </div>
          </div>
        );

      case "research_tech":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Research Tech Companies</h2>
            <div className="space-y-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">TechCorp (TECH)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Fast-growing cloud computing company</li>
                    <li>Recent earnings beat expectations</li>
                    <li>P/E ratio: 45</li>
                    <li>Risk: High</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">DataFlow (DATA)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>AI and data analytics leader</li>
                    <li>Strong revenue growth</li>
                    <li>P/E ratio: 38</li>
                    <li>Risk: High</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CloudNet (CLD)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Established cloud infrastructure provider</li>
                    <li>Steady growth</li>
                    <li>P/E ratio: 32</li>
                    <li>Risk: Moderate</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("invest_techcorp")}
              >
                Invest in TechCorp
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("invest_dataflow")}
              >
                Invest in DataFlow
              </Button>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setCurrentScene("invest_cloudnet")}
              >
                Invest in CloudNet
              </Button>
            </div>
          </div>
        );

      case "invest_techcorp":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Invest in TechCorp</h2>
            <p className="text-gray-600 mb-6">
              How much would you like to invest in TechCorp?
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital - 25000,
                    portfolio: { ...prev.portfolio, TECH: 25000 },
                    firstTrade: true,
                    currentSector: "tech"
                  }));
                  setCurrentScene("invest_amount_25k");
                }}
              >
                Invest $25,000
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital - 50000,
                    portfolio: { ...prev.portfolio, TECH: 50000 },
                    firstTrade: true,
                    currentSector: "tech"
                  }));
                  setCurrentScene("invest_amount_50k");
                }}
              >
                Invest $50,000
              </Button>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital - 75000,
                    portfolio: { ...prev.portfolio, TECH: 75000 },
                    firstTrade: true,
                    currentSector: "tech"
                  }));
                  setCurrentScene("invest_amount_75k");
                }}
              >
                Invest $75,000
              </Button>
            </div>
          </div>
        );

      case "invest_amount_25k":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Investment Results</h2>
            <p className="text-gray-600 mb-6">
              You've invested $25,000 in TechCorp.
            </p>
            <p className="text-gray-600 mb-6">
              A week later, the company announces strong earnings and the stock price increases by 15%!
            </p>
            <p className="text-gray-600 mb-6">
              Your investment is now worth ${(25000 * 1.15).toLocaleString()}.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("hold_position")}
              >
                Hold the Position
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital + (25000 * 1.15),
                    portfolio: { ...prev.portfolio },
                    lastTradeResult: "profit",
                    tradingExperience: prev.tradingExperience + 1
                  }));
                  delete gameState.portfolio.TECH;
                  setCurrentScene("take_profits");
                }}
              >
                Take Profits
              </Button>
            </div>
          </div>
        );

      case "take_profits":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Profit Taking</h2>
            <p className="text-gray-600 mb-6">
              You've successfully taken profits from your TechCorp investment!
            </p>
            <p className="text-gray-600 mb-6">
              Your current capital is now ${gameState.currentCapital.toLocaleString()}.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("next_investment_decision")}
              >
                Make Your Next Investment Decision
              </Button>
            </div>
          </div>
        );

      case "next_investment_decision":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Next Investment Decision</h2>
            <p className="text-gray-600 mb-6">
              With your current capital of ${gameState.currentCapital.toLocaleString()}, what would you like to do next?
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("research_tech")}
              >
                Research More Tech Companies
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("choose_next_strategy")}
              >
                Try a Different Investment Strategy
              </Button>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setCurrentScene("market_analysis")}
              >
                Analyze Market Conditions
              </Button>
            </div>
          </div>
        );

      case "market_analysis":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Market Analysis</h2>
            <div className="space-y-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Market Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Tech Sector: Showing signs of overvaluation</li>
                    <li>Healthcare Sector: Stable with growth potential</li>
                    <li>Financial Sector: Undervalued with strong fundamentals</li>
                    <li>Overall Market: Moderate volatility</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("healthcare_opportunity")}
              >
                Explore Healthcare Opportunities
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("financial_opportunity")}
              >
                Explore Financial Sector Opportunities
              </Button>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setCurrentScene("choose_next_strategy")}
              >
                Choose a Different Strategy
              </Button>
            </div>
          </div>
        );

      case "healthcare_opportunity":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Healthcare Investment Opportunity</h2>
            <div className="space-y-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">HealthTech (HEAL)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Innovative medical technology company</li>
                    <li>Strong R&D pipeline</li>
                    <li>Recent FDA approval</li>
                    <li>Risk: Moderate to High</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("healthcare_success")}
              >
                Invest in HealthTech
              </Button>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => setCurrentScene("healthcare_missed")}
              >
                Pass on Investment
              </Button>
            </div>
          </div>
        );

      case "healthcare_success":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Healthcare Investment Success</h2>
            <p className="text-gray-600 mb-6">
              You invest $30,000 in HealthTech.
            </p>
            <p className="text-gray-600 mb-6">
              Three months later, the company announces a breakthrough in their R&D pipeline, and the stock price increases by 40%.
            </p>
            <p className="text-gray-600 mb-6">
              Your investment is now worth ${(30000 * 1.40).toLocaleString()}.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("ending_successful")}
              >
                Continue Your Investment Journey
              </Button>
            </div>
          </div>
        );

      case "healthcare_missed":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Missed Healthcare Opportunity</h2>
            <p className="text-gray-600 mb-6">
              You decide to pass on investing in HealthTech.
            </p>
            <p className="text-gray-600 mb-6">
              Three months later, the company announces a breakthrough in their R&D pipeline, and the stock price increases by 40%.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("ending_learning")}
              >
                Learn from This Experience
              </Button>
            </div>
          </div>
        );

      case "financial_opportunity":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Financial Sector Opportunity</h2>
            <div className="space-y-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">FinBank (FNBK)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Well-established regional bank</li>
                    <li>Strong balance sheet</li>
                    <li>3.2% dividend yield</li>
                    <li>Risk: Low to Moderate</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("financial_success")}
              >
                Invest in FinBank
              </Button>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => setCurrentScene("financial_missed")}
              >
                Pass on Investment
              </Button>
            </div>
          </div>
        );

      case "financial_success":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Financial Investment Success</h2>
            <p className="text-gray-600 mb-6">
              You invest $30,000 in FinBank.
            </p>
            <p className="text-gray-600 mb-6">
              Over the next six months, you receive $960 in dividends (3.2% yield), and the stock price increases by 12%.
            </p>
            <p className="text-gray-600 mb-6">
              Your total return is 15.2%: 12% capital appreciation + 3.2% dividend yield.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("ending_balanced")}
              >
                Continue Your Investment Journey
              </Button>
            </div>
          </div>
        );

      case "financial_missed":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Missed Financial Opportunity</h2>
            <p className="text-gray-600 mb-6">
              You decide to pass on investing in FinBank.
            </p>
            <p className="text-gray-600 mb-6">
              Over the next six months, the stock provides a total return of 15.2% through dividends and price appreciation.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("ending_learning")}
              >
                Learn from This Experience
              </Button>
            </div>
          </div>
        );

      case "ending_successful":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">🎉 Successful Investment Journey 🎉</h2>
            <div className="space-y-4 mb-6">
              <p className="text-gray-700">Congratulations! You've achieved the "Successful Investor" ending!</p>
              <p className="text-gray-700">Your final portfolio value: ${gameState.currentCapital.toLocaleString()}</p>
              <p className="text-gray-700">Key achievements:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Successfully identified and acted on investment opportunities</li>
                <li>Demonstrated understanding of different investment strategies</li>
                <li>Managed risk effectively</li>
                <li>Built a diversified portfolio</li>
              </ul>
              <p className="text-gray-700 mt-4">You've proven yourself as a skilled investor who can identify and capitalize on market opportunities!</p>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setLocation("/learn")}
              >
                Return to Learning Center
              </Button>
            </div>
          </div>
        );

      case "ending_balanced":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">⚖️ Balanced Investment Journey ⚖️</h2>
            <div className="space-y-4 mb-6">
              <p className="text-gray-700">Congratulations! You've achieved the "Balanced Investor" ending!</p>
              <p className="text-gray-700">Your final portfolio value: ${gameState.currentCapital.toLocaleString()}</p>
              <p className="text-gray-700">Key takeaways:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Successfully combined different investment strategies</li>
                <li>Maintained a balanced risk profile</li>
                <li>Generated both capital gains and income</li>
                <li>Learned the importance of portfolio diversification</li>
              </ul>
              <p className="text-gray-700 mt-4">You've shown great skill in maintaining a balanced approach to investing!</p>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setLocation("/learn")}
              >
                Return to Learning Center
              </Button>
            </div>
          </div>
        );

      case "ending_learning":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="text-2xl font-bold mb-4"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              📚 Learning Experience 📚
            </motion.h2>
            <motion.div 
              className="space-y-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-gray-700">You've achieved the "Learning Investor" ending!</p>
              <p className="text-gray-700">Your final portfolio value: ${gameState.currentCapital.toLocaleString()}</p>
              <p className="text-gray-700">Key lessons learned:</p>
              <motion.ul 
                className="list-disc pl-5 space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.li 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Importance of thorough research before investing
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Value of diversification across different strategies
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Understanding risk management
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  Patience and long-term thinking
                </motion.li>
              </motion.ul>
              <motion.p 
                className="text-gray-700 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Remember: Every investment decision, whether successful or not, is an opportunity to learn and improve!
              </motion.p>
            </motion.div>
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => setLocation("/learn")}
                >
                  Return to Learning Center
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        );

      case "invest_tech_etf":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tech ETF Investment</h2>
            <div className="space-y-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tech Sector ETF (TECH)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Diversified exposure to tech sector</li>
                    <li>Low expense ratio (0.1%)</li>
                    <li>Includes major tech companies</li>
                    <li>Risk: Moderate</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital - 40000,
                    portfolio: { ...prev.portfolio, TECH_ETF: 40000 },
                    firstTrade: true,
                    currentSector: "tech",
                    investmentStrategy: "index"
                  }));
                  setCurrentScene("tech_etf_results");
                }}
              >
                Invest $40,000
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital - 60000,
                    portfolio: { ...prev.portfolio, TECH_ETF: 60000 },
                    firstTrade: true,
                    currentSector: "tech",
                    investmentStrategy: "index"
                  }));
                  setCurrentScene("tech_etf_results");
                }}
              >
                Invest $60,000
              </Button>
            </div>
          </div>
        );

      case "tech_etf_results":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tech ETF Investment Results</h2>
            <p className="text-gray-600 mb-6">
              You've invested in the Tech Sector ETF.
            </p>
            <p className="text-gray-600 mb-6">
              Over the next three months, the tech sector experiences steady growth, and your investment increases by 12%.
            </p>
            <p className="text-gray-600 mb-6">
              Your investment is now worth ${(gameState.portfolio.TECH_ETF * 1.12).toLocaleString()}.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital + (prev.portfolio.TECH_ETF * 1.12),
                    portfolio: { ...prev.portfolio },
                    lastTradeResult: "profit",
                    tradingExperience: prev.tradingExperience + 1
                  }));
                  delete gameState.portfolio.TECH_ETF;
                  setCurrentScene("next_investment_decision");
                }}
              >
                Take Profits and Continue
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("next_investment_decision")}
              >
                Hold Position and Continue
              </Button>
            </div>
          </div>
        );

      case "invest_dataflow":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Invest in DataFlow</h2>
            <p className="text-gray-600 mb-6">
              How much would you like to invest in DataFlow?
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital - 30000,
                    portfolio: { ...prev.portfolio, DATA: 30000 },
                    firstTrade: true,
                    currentSector: "tech"
                  }));
                  setCurrentScene("dataflow_results");
                }}
              >
                Invest $30,000
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital - 50000,
                    portfolio: { ...prev.portfolio, DATA: 50000 },
                    firstTrade: true,
                    currentSector: "tech"
                  }));
                  setCurrentScene("dataflow_results");
                }}
              >
                Invest $50,000
              </Button>
            </div>
          </div>
        );

      case "dataflow_results":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">DataFlow Investment Results</h2>
            <p className="text-gray-600 mb-6">
              You've invested in DataFlow.
            </p>
            <p className="text-gray-600 mb-6">
              Two weeks later, the company announces a major AI breakthrough, and the stock price surges by 25%!
            </p>
            <p className="text-gray-600 mb-6">
              Your investment is now worth ${(gameState.portfolio.DATA * 1.25).toLocaleString()}.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital + (prev.portfolio.DATA * 1.25),
                    portfolio: { ...prev.portfolio },
                    lastTradeResult: "profit",
                    tradingExperience: prev.tradingExperience + 1
                  }));
                  delete gameState.portfolio.DATA;
                  setCurrentScene("next_investment_decision");
                }}
              >
                Take Profits and Continue
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("hold_dataflow")}
              >
                Hold Position
              </Button>
            </div>
          </div>
        );

      case "hold_dataflow":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Holding DataFlow</h2>
            <p className="text-gray-600 mb-6">
              You decide to hold your position in DataFlow.
            </p>
            <p className="text-gray-600 mb-6">
              A month later, market sentiment shifts and tech stocks face pressure. DataFlow's stock price drops by 10%.
            </p>
            <p className="text-gray-600 mb-6">
              Your investment is now worth ${(gameState.portfolio.DATA * 1.25 * 0.90).toLocaleString()}.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("continue_holding_dataflow")}
              >
                Continue Holding
              </Button>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital + (prev.portfolio.DATA * 1.25 * 0.90),
                    portfolio: { ...prev.portfolio },
                    lastTradeResult: "profit",
                    tradingExperience: prev.tradingExperience + 1
                  }));
                  delete gameState.portfolio.DATA;
                  setCurrentScene("next_investment_decision");
                }}
              >
                Sell and Take Profits
              </Button>
            </div>
          </div>
        );

      case "continue_holding_dataflow":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Long-term Results</h2>
            <p className="text-gray-600 mb-6">
              You maintain your position in DataFlow, believing in the company's long-term potential.
            </p>
            <p className="text-gray-600 mb-6">
              Three months later, the company announces a major partnership and the stock price increases by 35%!
            </p>
            <p className="text-gray-600 mb-6">
              Your investment is now worth ${(gameState.portfolio.DATA * 1.25 * 0.90 * 1.35).toLocaleString()}.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital + (prev.portfolio.DATA * 1.25 * 0.90 * 1.35),
                    portfolio: { ...prev.portfolio },
                    lastTradeResult: "profit",
                    tradingExperience: prev.tradingExperience + 1
                  }));
                  delete gameState.portfolio.DATA;
                  setCurrentScene("ending_successful");
                }}
              >
                Take Profits and End Journey
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("next_investment_decision")}
              >
                Continue Investing
              </Button>
            </div>
          </div>
        );

      case "invest_cloudnet":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Invest in CloudNet</h2>
            <p className="text-gray-600 mb-6">
              How much would you like to invest in CloudNet?
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital - 35000,
                    portfolio: { ...prev.portfolio, CLD: 35000 },
                    firstTrade: true,
                    currentSector: "tech"
                  }));
                  setCurrentScene("cloudnet_results");
                }}
              >
                Invest $35,000
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital - 55000,
                    portfolio: { ...prev.portfolio, CLD: 55000 },
                    firstTrade: true,
                    currentSector: "tech"
                  }));
                  setCurrentScene("cloudnet_results");
                }}
              >
                Invest $55,000
              </Button>
            </div>
          </div>
        );

      case "cloudnet_results":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">CloudNet Investment Results</h2>
            <p className="text-gray-600 mb-6">
              You've invested in CloudNet.
            </p>
            <p className="text-gray-600 mb-6">
              Over the next month, the company reports strong earnings and the stock price increases by 18%.
            </p>
            <p className="text-gray-600 mb-6">
              Your investment is now worth ${(gameState.portfolio.CLD * 1.18).toLocaleString()}.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital + (prev.portfolio.CLD * 1.18),
                    portfolio: { ...prev.portfolio },
                    lastTradeResult: "profit",
                    tradingExperience: prev.tradingExperience + 1
                  }));
                  delete gameState.portfolio.CLD;
                  setCurrentScene("next_investment_decision");
                }}
              >
                Take Profits and Continue
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("next_investment_decision")}
              >
                Hold Position and Continue
              </Button>
            </div>
          </div>
        );

      case "hold_position":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Holding TechCorp</h2>
            <p className="text-gray-600 mb-6">
              You decide to hold your position in TechCorp.
            </p>
            <p className="text-gray-600 mb-6">
              A month later, market sentiment shifts and tech stocks face pressure. TechCorp's stock price drops by 8%.
            </p>
            <p className="text-gray-600 mb-6">
              Your investment is now worth ${(25000 * 1.15 * 0.92).toLocaleString()}.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("continue_holding")}
              >
                Continue Holding
              </Button>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital + (25000 * 1.15 * 0.92),
                    portfolio: { ...prev.portfolio },
                    lastTradeResult: "profit",
                    tradingExperience: prev.tradingExperience + 1
                  }));
                  delete gameState.portfolio.TECH;
                  setCurrentScene("next_investment_decision");
                }}
              >
                Sell and Take Profits
              </Button>
            </div>
          </div>
        );

      case "continue_holding":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Long-term Results</h2>
            <p className="text-gray-600 mb-6">
              You maintain your position in TechCorp, believing in the company's long-term potential.
            </p>
            <p className="text-gray-600 mb-6">
              Three months later, the company announces a major partnership and the stock price increases by 25%!
            </p>
            <p className="text-gray-600 mb-6">
              Your investment is now worth ${(25000 * 1.15 * 0.92 * 1.25).toLocaleString()}.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital + (25000 * 1.15 * 0.92 * 1.25),
                    portfolio: { ...prev.portfolio },
                    lastTradeResult: "profit",
                    tradingExperience: prev.tradingExperience + 1
                  }));
                  delete gameState.portfolio.TECH;
                  setCurrentScene("ending_successful");
                }}
              >
                Take Profits and End Journey
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("next_investment_decision")}
              >
                Continue Investing
              </Button>
            </div>
          </div>
        );

      case "choose_next_strategy":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Choose Your Next Strategy</h2>
            <p className="text-gray-600 mb-6">
              With your current capital of ${gameState.currentCapital.toLocaleString()}, which investment strategy would you like to try next?
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("value_investing_path")}
              >
                Value Investing Path
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("dividend_investing_path")}
              >
                Dividend Investing Path
              </Button>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setCurrentScene("index_investing_path")}
              >
                Index Investing Path
              </Button>
            </div>
          </div>
        );

      case "value_investing_path":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Value Investing Opportunity</h2>
            <div className="space-y-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SteadyCorp (STDY)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Undervalued manufacturing company</li>
                    <li>Strong cash flow</li>
                    <li>P/E ratio: 12 (below industry average)</li>
                    <li>Risk: Low to Moderate</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital - 40000,
                    portfolio: { ...prev.portfolio, STDY: 40000 },
                    investmentStrategy: "value"
                  }));
                  setCurrentScene("value_investing_success");
                }}
              >
                Invest in SteadyCorp
              </Button>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => setCurrentScene("value_investing_missed")}
              >
                Pass on Investment
              </Button>
            </div>
          </div>
        );

      case "value_investing_success":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Value Investment Success</h2>
            <p className="text-gray-600 mb-6">
              You invest $40,000 in SteadyCorp.
            </p>
            <p className="text-gray-600 mb-6">
              Over the next six months, the market recognizes the company's true value, and the stock price increases by 35%.
            </p>
            <p className="text-gray-600 mb-6">
              Your investment is now worth ${(40000 * 1.35).toLocaleString()}.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital + (40000 * 1.35),
                    portfolio: { ...prev.portfolio },
                    lastTradeResult: "profit",
                    tradingExperience: prev.tradingExperience + 1
                  }));
                  delete gameState.portfolio.STDY;
                  setCurrentScene("ending_successful");
                }}
              >
                Take Profits and End Journey
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("next_investment_decision")}
              >
                Continue Investing
              </Button>
            </div>
          </div>
        );

      case "value_investing_missed":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Missed Value Opportunity</h2>
            <p className="text-gray-600 mb-6">
              You decide to pass on investing in SteadyCorp.
            </p>
            <p className="text-gray-600 mb-6">
              Over the next six months, the market recognizes the company's true value, and the stock price increases by 35%.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("ending_learning")}
              >
                Learn from This Experience
              </Button>
            </div>
          </div>
        );

      case "dividend_investing_path":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Dividend Investing Opportunity</h2>
            <div className="space-y-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">UtilityCo (UTIL)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Stable utility company</li>
                    <li>4.5% dividend yield</li>
                    <li>Consistent earnings</li>
                    <li>Risk: Low</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital - 45000,
                    portfolio: { ...prev.portfolio, UTIL: 45000 },
                    investmentStrategy: "dividend"
                  }));
                  setCurrentScene("dividend_investing_success");
                }}
              >
                Invest in UtilityCo
              </Button>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => setCurrentScene("dividend_investing_missed")}
              >
                Pass on Investment
              </Button>
            </div>
          </div>
        );

      case "dividend_investing_success":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Dividend Investment Success</h2>
            <p className="text-gray-600 mb-6">
              You invest $45,000 in UtilityCo.
            </p>
            <p className="text-gray-600 mb-6">
              Over the next year, you receive $2,025 in dividends (4.5% yield), and the stock price increases by 8%.
            </p>
            <p className="text-gray-600 mb-6">
              Your total return is 12.5%: 8% capital appreciation + 4.5% dividend yield.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital + (45000 * 1.125),
                    portfolio: { ...prev.portfolio },
                    lastTradeResult: "profit",
                    tradingExperience: prev.tradingExperience + 1
                  }));
                  delete gameState.portfolio.UTIL;
                  setCurrentScene("ending_balanced");
                }}
              >
                Take Profits and End Journey
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("next_investment_decision")}
              >
                Continue Investing
              </Button>
            </div>
          </div>
        );

      case "dividend_investing_missed":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Missed Dividend Opportunity</h2>
            <p className="text-gray-600 mb-6">
              You decide to pass on investing in UtilityCo.
            </p>
            <p className="text-gray-600 mb-6">
              Over the next year, the stock provides a total return of 12.5% through dividends and price appreciation.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("ending_learning")}
              >
                Learn from This Experience
              </Button>
            </div>
          </div>
        );

      case "index_investing_path":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Index Investing Opportunity</h2>
            <div className="space-y-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Market Index Fund (MKT)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Broad market exposure</li>
                    <li>Low expense ratio (0.05%)</li>
                    <li>Diversified portfolio</li>
                    <li>Risk: Low</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital - 50000,
                    portfolio: { ...prev.portfolio, MKT: 50000 },
                    investmentStrategy: "index"
                  }));
                  setCurrentScene("index_investing_success");
                }}
              >
                Invest in Market Index Fund
              </Button>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => setCurrentScene("index_investing_missed")}
              >
                Pass on Investment
              </Button>
            </div>
          </div>
        );

      case "index_investing_success":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Index Investment Success</h2>
            <p className="text-gray-600 mb-6">
              You invest $50,000 in the Market Index Fund.
            </p>
            <p className="text-gray-600 mb-6">
              Over the next year, the market experiences steady growth, and your investment increases by 15%.
            </p>
            <p className="text-gray-600 mb-6">
              Your investment is now worth ${(50000 * 1.15).toLocaleString()}.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    currentCapital: prev.currentCapital + (50000 * 1.15),
                    portfolio: { ...prev.portfolio },
                    lastTradeResult: "profit",
                    tradingExperience: prev.tradingExperience + 1
                  }));
                  delete gameState.portfolio.MKT;
                  setCurrentScene("ending_balanced");
                }}
              >
                Take Profits and End Journey
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setCurrentScene("next_investment_decision")}
              >
                Continue Investing
              </Button>
            </div>
          </div>
        );

      case "index_investing_missed":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Missed Index Opportunity</h2>
            <p className="text-gray-600 mb-6">
              You decide to pass on investing in the Market Index Fund.
            </p>
            <p className="text-gray-600 mb-6">
              Over the next year, the market experiences steady growth, and the fund increases by 15%.
            </p>
            <div className="space-y-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentScene("ending_learning")}
              >
                Learn from This Experience
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            onClick={() => setLocation("/learn")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            {renderScene()}
          </CardContent>
        </Card>
      </div>
      <AppNavigation />
    </div>
  );
} 