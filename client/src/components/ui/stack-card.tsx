import { Clock, Star } from "lucide-react";
import type { Stack } from "@shared/schema";

interface StackCardProps {
  stack: Stack;
  onClick: (stackId: number) => void;
  imageUrl?: string;
  category?: string;
}

export default function StackCard({ stack, onClick, imageUrl, category }: StackCardProps) {
  return (
    <div 
      className="stack-card rounded-xl overflow-hidden flex flex-col"
      onClick={() => onClick(stack.id)}
    >
      <div className="relative h-36 overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ 
            backgroundColor: stack.color || '#1d1d31',
            backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {category && (
          <div className="absolute top-3 left-3 bg-black/50 rounded-full px-3 py-1 text-xs">
            {category}
          </div>
        )}
        
        <div className="absolute bottom-3 left-3 bg-black/50 rounded-full px-3 py-1 flex items-center space-x-1 text-xs">
          <Star className="w-3 h-3 text-yellow-400" />
          <span>{stack.rating}.0</span>
        </div>
        
        <div className="absolute bottom-3 right-3 bg-black/50 rounded-full px-3 py-1 flex items-center space-x-1 text-xs">
          <Clock className="w-3 h-3 text-gray-300" />
          <span>{stack.estimatedMinutes} min</span>
        </div>
      </div>
      
      <div className="px-3 py-3 flex-1 flex flex-col justify-between">
        <h3 className="font-semibold mb-1 text-white">{stack.title}</h3>
        <p className="text-xs text-gray-400 line-clamp-2">{stack.description}</p>
        
        <div className="mt-2 flex items-center space-x-2">
          <div className={`badge badge-${stack.difficulty}`}>
            {stack.difficulty}
          </div>
          <div className="badge badge-cards">
            {stack.cardCount} cards
          </div>
        </div>
      </div>
    </div>
  );
}