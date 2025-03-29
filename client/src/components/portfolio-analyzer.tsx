import { useState, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePortfolio, PortfolioHolding } from "@/contexts/portfolio-context";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/**
 * PortfolioAnalyzer component provides AI-powered portfolio analysis
 * It allows users to ask questions about their portfolio and get AI-generated insights
 */
export default function PortfolioAnalyzer() {
  const portfolio = usePortfolio();
  
  if (!portfolio) {
    throw new Error("Portfolio context not available");
  }
  
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Submit handler for the query form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Prepare the message to send
    const userMessage = { role: "user" as const, content: query.trim() };
    
    // Update conversation state
    setConversation(prev => [...prev, userMessage]);
    
    // Reset input field and set loading state
    setQuery("");
    setIsLoading(true);
    
    try {
      // Extract relevant portfolio data for better context
      const portfolioData = portfolio.holdings.map((holding: PortfolioHolding) => ({
        ticker: holding.stock.ticker,
        name: holding.stock.name,
        shares: holding.shares,
        purchasePrice: holding.purchasePrice,
        currentValue: holding.value,
        return: ((holding.stock.price - holding.purchasePrice) / holding.purchasePrice) * 100,
      }));
      
      // Calculate total portfolio value and overall return
      const totalValue = portfolio.portfolioValue;
      const initialInvestment = portfolio.holdings.reduce(
        (sum: number, holding: PortfolioHolding) => sum + (holding.shares * holding.purchasePrice), 0
      );
      const overallReturn = initialInvestment > 0 ? ((totalValue - initialInvestment) / initialInvestment) * 100 : 0;
      
      // Send request to AI analysis endpoint
      const response = await fetch('/api/ai/portfolio-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          portfolioData,
          totalValue,
          overallReturn,
          portfolioQuality: portfolio.portfolioMetrics?.qualityScore || 0,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }
      
      const data = await response.json();
      
      // Add the AI response to the conversation
      setConversation(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      toast({
        title: "Error",
        description: "Unable to get AI analysis at this time. Please try again later.",
        variant: "destructive",
      });
      
      // Add error message to conversation
      setConversation(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: "I'm sorry, I'm having trouble analyzing your portfolio right now. Please try again later." 
        }
      ]);
    } finally {
      setIsLoading(false);
      // Scroll to the bottom after state updates
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <div className="portfolio-analyzer rounded-xl border border-blue-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 border-l-4 border-blue-700">
        <h2 className="text-white font-semibold text-lg">AI Portfolio Advisor</h2>
        <p className="text-blue-50 text-sm">
          Ask questions about your portfolio performance, investment strategies, or specific stocks
        </p>
      </div>
      
      {/* Conversation Area */}
      <div className="conversation-container bg-gradient-to-b from-blue-50 to-white p-4 max-h-[300px] overflow-y-auto">
        {conversation.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>Ask me about your portfolio performance or investment strategy!</p>
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              <SuggestionButton 
                text="Analyze my portfolio" 
                onClick={() => {
                  setQuery("Analyze my portfolio performance and suggest improvements");
                  setTimeout(() => {
                    const form = document.getElementById('portfolio-ai-form') as HTMLFormElement;
                    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
                  }, 100);
                }} 
              />
              <SuggestionButton 
                text="Compare to market" 
                onClick={() => {
                  setQuery("How is my portfolio performing compared to the overall market?");
                  setTimeout(() => {
                    const form = document.getElementById('portfolio-ai-form') as HTMLFormElement;
                    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
                  }, 100);
                }} 
              />
              <SuggestionButton 
                text="Diversification tips" 
                onClick={() => {
                  setQuery("How can I better diversify my current portfolio?");
                  setTimeout(() => {
                    const form = document.getElementById('portfolio-ai-form') as HTMLFormElement;
                    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
                  }, 100);
                }} 
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {conversation.map((message, index) => (
              <div 
                key={index} 
                className={`message ${
                  message.role === "user" ? "user-message ml-auto" : "assistant-message mr-auto"
                }`}
              >
                <div 
                  className={`inline-block max-w-[80%] px-4 py-3 rounded-xl ${
                    message.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="assistant-message mr-auto">
                <div className="inline-block px-4 py-3 rounded-xl bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input Form */}
      <form 
        id="portfolio-ai-form"
        onSubmit={handleSubmit} 
        className="border-t border-gray-200 p-4 bg-white"
      >
        <div className="flex gap-2">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your portfolio..."
            className="min-h-[60px] flex-grow"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !query.trim()}
            className="h-[60px] px-3"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </form>
      
      {/* Help Accordion */}
      <div className="border-t border-gray-200 bg-white">
        <Accordion type="single" collapsible>
          <AccordionItem value="help" className="border-0">
            <AccordionTrigger className="py-3 px-4 text-sm text-gray-600 hover:no-underline">
              <span className="flex items-center gap-1">
                What can I ask?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-sm text-gray-600">
              <ul className="space-y-2">
                <li>• Portfolio performance analysis and optimization</li>
                <li>• Sector diversification recommendations</li>
                <li>• Risk assessment of your current investments</li>
                <li>• Trends and patterns in your investment choices</li>
                <li>• Historical context for your portfolio returns</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

// Helper component for suggestion buttons
function SuggestionButton({ text, onClick }: { text: string, onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm py-1 px-3 bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition-colors"
    >
      {text}
    </button>
  );
}