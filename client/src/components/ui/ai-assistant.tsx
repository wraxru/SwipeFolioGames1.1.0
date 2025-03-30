import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, ChevronRight, Sparkles, Brain, MessageCircle, Share2, ArrowUp } from 'lucide-react';
import axios from 'axios';
import { usePortfolio } from '@/contexts/portfolio-context';

// Define message types
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Predefined questions for beginners
const suggestedQuestions = [
  "How do I start investing with a small budget?",
  "What's the difference between stocks and ETFs?",
  "How can I build a diversified portfolio?",
  "What metrics should I look at when evaluating stocks?",
  "How do I know if a stock is overvalued?",
  "What's a good investment strategy for beginners?",
  "How can I learn about market trends?"
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const portfolio = usePortfolio();

  // Add welcome message when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "👋 Hi there! I'm your AI investing assistant. I can help answer your questions about investing, stocks, and portfolio management. What would you like to know today?",
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isExpanded]);

  // Focus input when chat expands
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
    }
  };

  const expandChat = () => {
    setIsExpanded(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Get portfolio context data to provide to the AI
      const portfolioContext = portfolio ? {
        holdings: portfolio.holdings.length,
        totalValue: portfolio.portfolioValue,
        metrics: portfolio.portfolioMetrics,
      } : { holdings: 0, totalValue: 0, metrics: null };
      
      // Make the API request
      const response = await axios.post('/api/ai/chat', {
        message: inputValue,
        context: {
          portfolio: portfolioContext,
          previousMessages: messages.map(m => ({ role: m.role, content: m.content }))
        }
      });
      
      // Add AI response message
      if (response.data && response.data.response) {
        const aiMessage: Message = {
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Add error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetQuestion = (question: string) => {
    setSelectedPreset(question);
    setInputValue(question);
    setIsExpanded(true);
    
    // Slight delay to simulate user typing and then send
    setTimeout(() => {
      handleSendMessage();
    }, 300);
  };

  // Render message with formatting
  const renderMessageContent = (content: string) => {
    // Handle basic markdown-like formatting
    return content
      .split('\n')
      .map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        className="fixed right-6 bottom-24 z-40 w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)'
        }}
        whileHover={{ scale: 1.05, boxShadow: '0 15px 30px -5px rgba(99, 102, 241, 0.6)' }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <Bot className="w-6 h-6 text-white" />
            <motion.span
              className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </>
        )}
      </motion.button>

      {/* Chat interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-6 bottom-24 z-30 mb-16 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {isExpanded ? (
              // Expanded chat interface
              <div 
                className="w-[350px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden flex flex-col"
                style={{ height: '70vh', maxHeight: '600px' }}
              >
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">AI Advisor</h3>
                      <p className="text-xs text-white/80">Powered by AI</p>
                    </div>
                  </div>
                  <button 
                    onClick={toggleOpen}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Messages container */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 max-w-[85%] ${
                        message.role === 'user' ? 'ml-auto' : 'mr-auto'
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-indigo-500 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                        }`}
                      >
                        <div className="text-sm">
                          {renderMessageContent(message.content)}
                        </div>
                      </div>
                      <div
                        className={`text-xs mt-1 text-slate-500 ${
                          message.role === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center space-x-2 bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm mb-4 max-w-[85%]">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input box */}
                <div className="p-3 border-t border-slate-200 bg-white">
                  <div className="flex items-center bg-slate-100 rounded-full pr-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything about investing..."
                      className="flex-1 bg-transparent border-none py-2 px-4 text-slate-800 placeholder-slate-400 focus:outline-none rounded-full"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className={`p-2 rounded-full ${
                        inputValue.trim() && !isLoading
                          ? 'text-indigo-500 hover:bg-indigo-100'
                          : 'text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Suggested queries */}
                  <div className="mt-3 flex items-center">
                    <span className="text-xs font-medium text-slate-500 mr-2">Try asking:</span>
                    <div className="flex-1 overflow-x-auto no-scrollbar">
                      <div className="flex space-x-2">
                        {suggestedQuestions.slice(0, 3).map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handlePresetQuestion(question)}
                            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 flex-shrink-0"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Collapsed mini-interface
              <div className="w-[280px] bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
                {/* Compact header */}
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bot className="w-4 h-4 text-white mr-2" />
                      <h3 className="font-bold text-white text-sm">AI Advisor</h3>
                    </div>
                    <button onClick={toggleOpen} className="text-white/80 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-white/90 text-xs mt-1">How can I help you today?</p>
                </div>
                
                {/* Quick action buttons */}
                <div className="p-3 space-y-2">
                  {suggestedQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetQuestion(question)}
                      className="w-full text-left text-sm px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-between group transition-colors duration-150"
                    >
                      <span className="line-clamp-1">{question}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </button>
                  ))}
                </div>
                
                {/* Expand button */}
                <div className="p-3 pt-0">
                  <button
                    onClick={expandChat}
                    className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg flex items-center justify-center text-sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start chatting
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styling for typing indicator */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: #a5b4fc;
          border-radius: 50%;
          display: inline-block;
          margin-right: 3px;
          animation: typing 1.4s infinite ease-in-out both;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
          margin-right: 0;
        }
        
        @keyframes typing {
          0% { transform: scale(0.6); opacity: 0.6; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.6); opacity: 0.6; }
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `
      }} />
    </>
  );
}