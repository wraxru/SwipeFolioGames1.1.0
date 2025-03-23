import { useState } from "react";
import { Card } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, LightbulbIcon } from "lucide-react";

interface SwipeableCardProps {
  card: Card;
  onNextCard: () => void;
}

export default function SwipeableCard({ card, onNextCard }: SwipeableCardProps) {
  const [swipeDirection, setSwipeDirection] = useState<null | "left" | "right">(null);
  
  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);
    
    // Reset and move to the next card
    setTimeout(() => {
      setSwipeDirection(null);
      onNextCard();
    }, 300);
  };
  
  const getCardContent = () => {
    if (card.type === 'info') {
      return (
        <>
          <div className="prose">
            <p className="text-gray-700">{card.content.text}</p>
            
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              {card.content.models?.map((model, index) => (
                <div key={index} className="flex items-start mb-3 last:mb-0">
                  <i className={`ri-${model.icon} text-secondary-500 text-xl mr-2 mt-0.5`}></i>
                  <div>
                    <h4 className="font-medium text-gray-800">{model.name}</h4>
                    <p className="text-sm text-gray-600">{model.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {card.content.funFact && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-800">Fun Fact</h4>
                <p className="text-sm text-gray-600 italic mt-1">{card.content.funFact}</p>
              </div>
            )}
          </div>
        </>
      );
    } else if (card.type === 'data-viz') {
      return (
        <>
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Big Tech Revenue Breakdown</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              {card.content.companies?.map((company, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{company.name}</span>
                    <span className="text-xs text-gray-500">{company.revenue}</span>
                  </div>
                  <div className="flex w-full h-6 rounded-full overflow-hidden">
                    {company.segments.map((segment, idx) => (
                      <div 
                        key={idx} 
                        className={segment.color} 
                        style={{ width: `${segment.percentage}%` }}
                        title={segment.name}
                      ></div>
                    ))}
                  </div>
                  <div className="flex text-xs text-gray-500 mt-1 justify-between">
                    {company.segments.slice(0, 3).map((segment, idx) => (
                      <span key={idx}>{segment.name} {segment.percentage}%</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="prose">
            <h4 className="font-medium text-gray-800">Key Insight</h4>
            <p className="text-sm text-gray-600">{card.content.insight}</p>
            
            <div className="mt-4 bg-primary-50 p-3 rounded-lg">
              <p className="text-sm text-primary-700 font-medium flex items-center">
                <LightbulbIcon className="mr-2 text-primary-500" size={16} />
                {card.content.keyPoint}
              </p>
            </div>
          </div>
        </>
      );
    }
    
    return <p>Unsupported card type</p>;
  };
  
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md w-[85%] max-w-lg h-[70%] overflow-hidden"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) {
          handleSwipe("right");
        } else if (info.offset.x < -100) {
          handleSwipe("left");
        }
      }}
      animate={{
        x: swipeDirection === "left" ? -500 : swipeDirection === "right" ? 500 : 0,
        rotate: swipeDirection === "left" ? -10 : swipeDirection === "right" ? 10 : 0,
        opacity: swipeDirection ? 0 : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full flex flex-col">
        <div className={`bg-gradient-to-r ${
          card.type === 'info' 
            ? 'from-primary-400 to-primary-500' 
            : card.type === 'data-viz'
              ? 'from-green-400 to-green-500'
              : 'from-primary-400 to-primary-500'
        } px-5 py-4`}>
          <h3 className="text-white font-medium text-lg">{card.title}</h3>
          <p className="text-primary-100 text-sm">{card.subtitle}</p>
        </div>
        
        <div className="flex-1 p-5 overflow-auto">
          {getCardContent()}
        </div>
        
        <div className="p-4 bg-gray-50 border-t">
          <Button 
            onClick={() => handleSwipe("right")}
            className="w-full py-3"
          >
            <span>Continue</span>
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
