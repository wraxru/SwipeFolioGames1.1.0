import { useState } from "react";
import { Card } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface LessonCardProps {
  card: Card;
  onNextCard: () => void;
}

export default function LessonCard({ card, onNextCard }: LessonCardProps) {
  // Content for the card would be stored in card.content
  const content = card.content as { 
    title?: string;
    description?: string;
    imageUrl?: string;
    bulletPoints?: string[];
    funFact?: string;
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">{card.title}</h2>
        {card.subtitle && (
          <p className="text-gray-600 mt-1">{card.subtitle}</p>
        )}
      </div>
      
      <div className="space-y-4 mb-6">
        {content.description && (
          <p className="text-gray-700">{content.description}</p>
        )}
        
        {content.imageUrl && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={content.imageUrl} 
              alt={card.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        {content.bulletPoints && content.bulletPoints.length > 0 && (
          <ul className="list-disc pl-5 space-y-2">
            {content.bulletPoints.map((point, index) => (
              <li key={index} className="text-gray-700">{point}</li>
            ))}
          </ul>
        )}
        
        {content.funFact && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-700 font-medium">Fun Fact</p>
            <p className="text-blue-800">{content.funFact}</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onNextCard}
          className="flex items-center gap-2"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}