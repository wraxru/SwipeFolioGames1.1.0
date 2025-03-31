import { useState } from "react";
import { Card } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import ChoiceButton from "@/components/ui/choice-button";

interface QuizCardProps {
  card: Card;
  onNextCard: () => void;
}

export default function QuizCard({ card, onNextCard }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const handleAnswerSelect = (value: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(value);
    setShowFeedback(true);
  };
  
  const isCorrectAnswer = () => {
    if (!selectedAnswer) return false;
    
    const correctOption = card.content.options.find(opt => opt.isCorrect);
    return selectedAnswer === correctOption?.value;
  };
  
  const handleContinue = () => {
    onNextCard();
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md w-[85%] max-w-lg h-[70%] overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="bg-gradient-to-r from-accent-500 to-yellow-500 px-5 py-4">
          <h3 className="text-white font-medium text-lg">{card.title}</h3>
          <p className="text-yellow-100 text-sm">{card.subtitle}</p>
        </div>
        
        <div className="flex-1 p-5 overflow-auto">
          <div className="prose">
            <h4 className="font-medium text-gray-800 text-xl mb-4">
              {card.content.question}
            </h4>
            
            <div className="space-y-3 mt-6">
              {card.content.options.map((option, index) => (
                <ChoiceButton
                  key={index}
                  title={option.text}
                  value={option.value}
                  selected={selectedAnswer === option.value}
                  onClick={() => handleAnswerSelect(option.value)}
                  correct={showFeedback && option.isCorrect}
                  incorrect={showFeedback && selectedAnswer === option.value && !option.isCorrect}
                  disabled={showFeedback && selectedAnswer !== option.value && !option.isCorrect}
                  showFeedback={showFeedback}
                />
              ))}
            </div>
          </div>
        </div>
        
        {showFeedback && (
          <div className="p-4 bg-gray-50 border-t">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`p-3 ${
                isCorrectAnswer() 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              } rounded-lg mb-4`}>
                <div className="flex items-start">
                  {isCorrectAnswer() ? (
                    <CheckCircle className="text-green-500 mr-2 mt-0.5" size={20} />
                  ) : (
                    <XCircle className="text-red-500 mr-2 mt-0.5" size={20} />
                  )}
                  <div>
                    <h4 className={`font-medium ${
                      isCorrectAnswer() ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isCorrectAnswer() ? 'Correct!' : 'Not quite!'}
                    </h4>
                    <p className={`text-sm ${
                      isCorrectAnswer() ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isCorrectAnswer() 
                        ? card.content.correctFeedback 
                        : card.content.incorrectFeedback
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleContinue}
                className="w-full"
              >
                <span>Continue</span>
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
