import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { DecisionSwiper } from '@/components/ui/decision-swiper';
import { MetricDashboard } from '@/components/ui/metric-dashboard';
import { GameHeader, GameProgress } from '@/components/ui/game-elements';
import { ArrowLeft, Info, Crown, Trophy, Loader2 } from 'lucide-react';
import { 
  generateInitialScenario, 
  generateNextScenario,
  generateExplanation,
  DEFAULT_COMPANY_METRICS,
  NARRATIVE_STAGES
} from '@/services/board-room-ai';
import { CompanyMetrics, EnhancedBoardRoomDecision, MetricValue } from '@/types/game';
import { Skeleton } from '@/components/ui/skeleton';

// Industries available for the CEO simulator
const AVAILABLE_INDUSTRIES = [
  { id: 'tech', name: 'Technology', description: 'Develop software, hardware, and innovative tech solutions.' },
  { id: 'healthcare', name: 'Healthcare', description: 'Provide medical services, pharmaceuticals, or health tech.' },
  { id: 'finance', name: 'Financial Services', description: 'Offer banking, investment, or insurance products.' },
  { id: 'retail', name: 'Retail', description: 'Sell products directly to consumers through various channels.' },
  { id: 'energy', name: 'Energy', description: 'Generate, distribute, or service energy-related needs.' },
  { id: 'manufacturing', name: 'Manufacturing', description: 'Produce physical goods for consumer or industrial use.' }
];

type GamePhase = 'setup' | 'playing' | 'results';

export default function BoardRoomGame() {
  const [, navigate] = useLocation();
  
  // Game state
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [playerName, setPlayerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [currentScenario, setCurrentScenario] = useState<EnhancedBoardRoomDecision | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [narrativeStage, setNarrativeStage] = useState<string>(NARRATIVE_STAGES[0]);
  const [round, setRound] = useState(1);
  const [metrics, setMetrics] = useState<CompanyMetrics>(DEFAULT_COMPANY_METRICS);
  const [previousMetrics, setPreviousMetrics] = useState<CompanyMetrics | null>(null);
  const [decisionHistory, setDecisionHistory] = useState<any[]>([]);
  const [showImpactDialog, setShowImpactDialog] = useState(false);
  const [impactExplanation, setImpactExplanation] = useState<string | null>(null);
  const [currentImpact, setCurrentImpact] = useState<{metric: string, value: number, text: string} | null>(null);
  
  // Total number of rounds in the game
  const TOTAL_ROUNDS = 10;
  
  // Start the game
  const startGame = async () => {
    if (!playerName || !companyName || !selectedIndustry) {
      setError('Please fill in all fields to start the game.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Get initial scenario
      const initialScenario = await generateInitialScenario(
        playerName,
        companyName,
        AVAILABLE_INDUSTRIES.find(i => i.id === selectedIndustry)?.name || selectedIndustry
      );
      
      setCurrentScenario(initialScenario);
      setPhase('playing');
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to start game:', err);
      setError('Failed to start the game. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Handle making a decision
  const handleDecision = async (optionId: string) => {
    if (!currentScenario) return;
    
    setIsLoading(true);
    
    // Find selected option
    const selectedOption = currentScenario.options.find(opt => opt.id === optionId);
    
    if (!selectedOption) {
      setError('Invalid option selected.');
      setIsLoading(false);
      return;
    }
    
    try {
      // Store the current metrics for comparison
      setPreviousMetrics({...metrics});
      
      // Update metrics based on decision impacts
      const newMetrics = {...metrics};
      
      // Apply impacts of the chosen option
      selectedOption.impacts.forEach(impact => {
        // Apply specific metric impacts
        if (impact.metric in newMetrics) {
          // @ts-ignore - metrics object has string keys
          newMetrics[impact.metric] += impact.value;
        }
        
        // Also update the category score
        if (impact.category in newMetrics) {
          // @ts-ignore - metrics object has string keys
          newMetrics[impact.category] += Math.round(impact.value / 2); // Category changes less dramatically
          
          // Keep category scores within bounds
          // @ts-ignore - metrics object has string keys
          newMetrics[impact.category] = Math.max(0, Math.min(100, newMetrics[impact.category]));
        }
      });
      
      // Update metrics state
      setMetrics(newMetrics);
      
      // Add to decision history
      const decisionRecord = {
        title: currentScenario.title,
        selectedOptionId: optionId,
        selectedOption: selectedOption.text,
        impacts: selectedOption.impacts,
        round: round,
        stage: narrativeStage
      };
      
      setDecisionHistory([...decisionHistory, decisionRecord]);
      
      // Check if we should show impact dialog
      if (selectedOption.impacts.length > 0) {
        // Select random impact to highlight
        const randomImpact = selectedOption.impacts[Math.floor(Math.random() * selectedOption.impacts.length)];
        setCurrentImpact({
          metric: randomImpact.metric,
          value: randomImpact.value,
          text: selectedOption.text
        });
        setImpactExplanation(null);
        setShowImpactDialog(true);
        
        // Generate explanation in background
        generateExplanation(
          randomImpact.metric,
          randomImpact.value,
          selectedOption.text
        ).then(explanation => {
          setImpactExplanation(explanation);
        }).catch(err => {
          console.error('Failed to get explanation:', err);
          setImpactExplanation('No explanation available.');
        });
        
        // Allow some time to read the impacts before continuing
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Increment round
      const newRound = round + 1;
      setRound(newRound);
      
      // Check if game is over
      if (newRound > TOTAL_ROUNDS) {
        setPhase('results');
        setIsLoading(false);
        return;
      }
      
      // Update narrative stage every few rounds
      if (newRound % 2 === 1) {
        const stageIndex = Math.min(
          Math.floor(newRound / 2), 
          NARRATIVE_STAGES.length - 1
        );
        setNarrativeStage(NARRATIVE_STAGES[stageIndex]);
      }
      
      // Generate next scenario
      const gameState = {
        playerName,
        companyName,
        industry: AVAILABLE_INDUSTRIES.find(i => i.id === selectedIndustry)?.name || selectedIndustry,
        metrics: newMetrics,
        decisions: decisionHistory
      };
      
      const nextScenario = await generateNextScenario(gameState, narrativeStage);
      setCurrentScenario(nextScenario);
      setIsLoading(false);
    } catch (err) {
      console.error('Error processing decision:', err);
      setError('Failed to process your decision. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Convert company metrics to format for MetricDashboard
  const getMetricsForDashboard = (): MetricValue[] => {
    // Only include real metrics, not category scores
    const metricEntries = Object.entries(metrics).filter(([key]) => 
      !['Growth', 'Stability', 'Momentum', 'Value'].includes(key)
    );
    
    return metricEntries.map(([name, value]) => {
      // Determine category based on metric name
      let category: 'Growth' | 'Stability' | 'Momentum' | 'Value' = 'Value';
      
      if (['RevenueGrowth', 'ProfitMargin'].includes(name)) {
        category = 'Growth';
      } else if (['DebtLoad', 'Beta', 'Volatility'].includes(name)) {
        category = 'Stability';
      } else if (['RSI', 'ROI', 'ReturnOnCapital'].includes(name)) {
        category = 'Momentum';
      } else if (['EPS', 'PE_Ratio', 'PB_Ratio', 'DividendYield'].includes(name)) {
        category = 'Value';
      }
      
      // Add previous value if available
      const previousValue = previousMetrics ? previousMetrics[name as keyof CompanyMetrics] : undefined;
      
      // Add description based on metric
      let description = '';
      switch (name) {
        case 'EPS':
          description = 'Earnings Per Share - Company profit divided by outstanding shares';
          break;
        case 'PE_Ratio':
          description = 'Price to Earnings Ratio - Stock price relative to earnings';
          break;
        case 'DebtLoad':
          description = 'Percentage of company financed through debt';
          break;
        case 'RevenueGrowth':
          description = 'Year-over-year percentage increase in company revenue';
          break;
        case 'ProfitMargin':
          description = 'Percentage of revenue that becomes profit';
          break;
        case 'RSI':
          description = 'Relative Strength Index - Momentum indicator (0-100)';
          break;
        // Add descriptions for other metrics...
      }
      
      return {
        name: name.replace('_', ' '), // Format display name
        value,
        previousValue,
        category,
        description
      };
    });
  };
  
  // Handle game restart
  const restartGame = () => {
    setPhase('setup');
    setRound(1);
    setMetrics(DEFAULT_COMPANY_METRICS);
    setPreviousMetrics(null);
    setDecisionHistory([]);
    setCurrentScenario(null);
    setNarrativeStage(NARRATIVE_STAGES[0]);
  };
  
  // Calculate final score based on metrics
  const calculateFinalScore = (): number => {
    // Weight each category
    const growthWeight = 0.25;
    const stabilityWeight = 0.25;
    const momentumWeight = 0.25;
    const valueWeight = 0.25;
    
    // Calculate weighted score
    const score = 
      (metrics.Growth * growthWeight) +
      (metrics.Stability * stabilityWeight) +
      (metrics.Momentum * momentumWeight) +
      (metrics.Value * valueWeight);
    
    return Math.round(score);
  };
  
  // Render appropriate phase content
  const renderContent = () => {
    switch (phase) {
      case 'setup':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {/* Header with tickets */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-8 px-4">
              <h1 className="text-xl font-semibold">Board Room</h1>
              <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-amber-700 font-medium">3</span>
              </div>
            </div>

            {/* Main content card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-col items-center px-6 py-12 text-center">
                {/* Icon */}
                <div className="w-24 h-24 mb-8 bg-blue-100 rounded-2xl flex items-center justify-center transform rotate-12">
                  <Crown className="w-12 h-12 text-blue-500 transform -rotate-12" />
                </div>

                {/* Title and description */}
                <h2 className="text-2xl font-bold mb-4">Create Your Company</h2>
                <p className="text-gray-600 mb-8">
                  Take the helm as CEO and navigate strategic decisions!
                </p>

                {/* Error message if any */}
                {error && (
                  <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
                    {error}
                  </div>
                )}

                {/* Form fields */}
                <div className="space-y-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="playerName" className="text-left block">Your Name</Label>
                    <Input
                      id="playerName"
                      placeholder="Enter your name"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-left block">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Enter company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-left block">Industry</Label>
                    <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_INDUSTRIES.map((industry) => (
                          <SelectItem key={industry.id} value={industry.id}>
                            {industry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedIndustry && (
                      <p className="text-sm text-gray-500 text-left mt-1">
                        {AVAILABLE_INDUSTRIES.find(i => i.id === selectedIndustry)?.description}
                      </p>
                    )}
                  </div>

                  <Button
                    size="lg"
                    onClick={startGame}
                    disabled={isLoading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-6 rounded-xl transition-all duration-200 mt-4"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      'Start Your Company'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'playing':
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/games')}
                className="flex items-center text-gray-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Button>
            </div>
            
            <GameHeader 
              title="Board Room"
              description="Make strategic decisions as CEO"
              icon={<Crown className="h-6 w-6" />}
            />
            
            <GameProgress 
              current={round} 
              total={TOTAL_ROUNDS} 
            />
            
            <div className="bg-indigo-50 rounded-lg p-3 mb-4 mx-4">
              <p className="text-center text-indigo-700 font-medium">
                {narrativeStage}
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 px-4 py-2">
                {/* Company Metrics Dashboard */}
                <MetricDashboard 
                  metrics={getMetricsForDashboard()} 
                  companyName={companyName}
                />
                
                {/* Current Scenario */}
                {isLoading && !currentScenario ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : currentScenario ? (
                  <DecisionSwiper
                    title={currentScenario.title}
                    description={currentScenario.description}
                    options={currentScenario.options}
                    onDecision={handleDecision}
                    learningObjective={currentScenario.learningObjective}
                  />
                ) : (
                  <div className="text-center p-8">
                    <p>No scenario available. Please restart the game.</p>
                    <Button onClick={restartGame} className="mt-4">
                      Restart Game
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Educational Dialog */}
            <Dialog open={showImpactDialog} onOpenChange={setShowImpactDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-blue-500" />
                    Impact Explained
                  </DialogTitle>
                  <DialogDescription>
                    Understanding the effects of your decision
                  </DialogDescription>
                </DialogHeader>
                
                {currentImpact && (
                  <div className="space-y-4">
                    <p className="font-medium">
                      Your decision to "{currentImpact.text}" has changed {currentImpact.metric} by
                      <span className={currentImpact.value > 0 ? "text-green-600" : "text-red-600"}>
                        {" "}{currentImpact.value > 0 ? "+" : ""}{currentImpact.value}%
                      </span>
                    </p>
                    
                    {impactExplanation ? (
                      <p>{impactExplanation}</p>
                    ) : (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    )}
                  </div>
                )}
                
                <DialogFooter>
                  <Button onClick={() => setShowImpactDialog(false)}>
                    Continue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
        
      case 'results':
        const finalScore = calculateFinalScore();
        let performanceRating = '';
        
        if (finalScore >= 80) performanceRating = 'Outstanding CEO';
        else if (finalScore >= 65) performanceRating = 'Successful CEO';
        else if (finalScore >= 50) performanceRating = 'Competent CEO';
        else if (finalScore >= 35) performanceRating = 'Struggling CEO';
        else performanceRating = 'Failed CEO';
        
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/games')}
                className="flex items-center text-gray-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Button>
            </div>
            
            <GameHeader 
              title="Board Room"
              description="Review your company performance"
              icon={<Crown className="h-6 w-6" />}
            />
            
            <div className="flex-1 overflow-y-auto p-4">
              <Card className="mb-6">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl flex justify-center items-center">
                    <Crown className="mr-2 h-6 w-6 text-yellow-500" />
                    Game Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">{performanceRating}</h3>
                    <p className="text-gray-500">Final Score: {finalScore}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Growth</p>
                      <p className="text-xl font-bold">{metrics.Growth}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Stability</p>
                      <p className="text-xl font-bold">{metrics.Stability}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Momentum</p>
                      <p className="text-xl font-bold">{metrics.Momentum}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Value</p>
                      <p className="text-xl font-bold">{metrics.Value}</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="font-medium mb-2">Key Decisions</h4>
                    <ul className="space-y-2 text-sm">
                      {decisionHistory.slice(-3).map((decision, idx) => (
                        <li key={idx} className="bg-gray-50 p-2 rounded">
                          {decision.title}: <span className="font-medium">{decision.selectedOption}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={restartGame}
                >
                  Play Again
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/games')}
                >
                  Return to Games Hub
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {renderContent()}
    </div>
  );
}