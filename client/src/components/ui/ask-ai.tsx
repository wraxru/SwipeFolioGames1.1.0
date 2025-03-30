import { useState, FormEvent } from 'react';
import { StockData } from '@/lib/stock-data';
import { Loader2, Send, Sparkles } from 'lucide-react';
import axios from 'axios';

interface AskAIProps {
  stock: StockData;
}

export default function AskAI({ stock }: AskAIProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    // Don't submit empty questions
    if (!question.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/ai/ask-stock', {
        userQuestion: question,
        stockContext: {
          name: stock.name,
          ticker: stock.ticker,
          description: stock.description,
          price: stock.price,
          industry: stock.industry,
          metrics: {
            performance: stock.metrics?.performance?.value,
            stability: stock.metrics?.stability?.value,
            value: stock.metrics?.value?.value,
            momentum: stock.metrics?.momentum?.value
          }
        }
      });
      
      setAnswer(response.data.answer);
    } catch (err: any) {
      console.error('Error asking AI:', err);
      setError(err.response?.data?.message || 'Failed to get an answer. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 p-3 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center">
          <Sparkles className="h-4 w-4 text-indigo-500 mr-2" />
          <h4 className="font-semibold text-slate-800">Ask AI About {stock.ticker}</h4>
        </div>
      </div>
      
      <div className="p-3">
        {answer ? (
          <div className="mb-4">
            <div className="text-xs text-slate-500 mb-1">Your question:</div>
            <div className="text-sm font-medium text-slate-700 mb-2">{question}</div>
            <div className="text-xs text-slate-500 mb-1">AI response:</div>
            <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {answer}
            </div>
            <button 
              onClick={() => {
                setAnswer('');
                setQuestion('');
              }}
              className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              Ask another question
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="flex items-center gap-2 relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={`Ask about ${stock.name}...`}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className={`absolute right-2 p-1 rounded-full ${
                  question.trim() 
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                    : 'bg-slate-200 text-slate-400'
                } transition-colors`}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {error && (
              <div className="mt-2 text-sm text-red-500">
                {error}
              </div>
            )}
            
            <div className="mt-2 text-xs text-slate-400">
              Try asking "What's unique about this company?" or "What are the risks?"
            </div>
          </form>
        )}
      </div>
    </div>
  );
}