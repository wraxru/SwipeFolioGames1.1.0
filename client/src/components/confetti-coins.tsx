import React, { useCallback, useRef, useEffect } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";

interface ConfettiCoinsProps {
  fire: boolean;
  repeat?: boolean;
  repeatInterval?: number;
}

const ConfettiCoins: React.FC<ConfettiCoinsProps> = ({ 
  fire, 
  repeat = false, 
  repeatInterval = 20000 
}) => {
  const refAnimationInstance = useRef<any>(null);
  
  // Get confetti instance
  const getInstance = useCallback((instance: any) => {
    refAnimationInstance.current = instance;
  }, []);

  // Function to fire gold coins
  const makeGoldCoinShot = useCallback((particleRatio: number, opts: any) => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0, x: 0.5 }, // Top center of the screen
        particleCount: Math.floor(200 * particleRatio),
      });
    }
  }, []);

  // Animation for gold coins rain effect
  const fireGoldCoins = useCallback(() => {
    // Golden colors for coins
    const goldColors = ['#FFD700', '#FFDF00', '#F7D358', '#FFCC33', '#FFC125', '#EAC117'];
    
    // First burst - center
    makeGoldCoinShot(0.4, {
      spread: 80,
      startVelocity: 25,
      decay: 0.94,
      scalar: 1.2,
      ticks: 100,
      shapes: ["circle"],
      colors: goldColors
    });
    
    // Second burst - left side
    setTimeout(() => {
      makeGoldCoinShot(0.3, {
        spread: 60,
        origin: { y: 0, x: 0.3 },
        startVelocity: 35,
        decay: 0.93,
        scalar: 1.0,
        shapes: ["circle"],
        colors: goldColors
      });
    }, 300);
    
    // Third burst - right side
    setTimeout(() => {
      makeGoldCoinShot(0.3, {
        spread: 60,
        origin: { y: 0, x: 0.7 },
        startVelocity: 35,
        decay: 0.93,
        scalar: 1.0,
        shapes: ["circle"],
        colors: goldColors
      });
    }, 600);
    
    // Final burst
    setTimeout(() => {
      makeGoldCoinShot(0.2, {
        spread: 100,
        startVelocity: 45,
        decay: 0.9,
        scalar: 0.8,
        shapes: ["circle"],
        colors: goldColors
      });
    }, 900);
    
  }, [makeGoldCoinShot]);
  
  // Fire initial confetti
  useEffect(() => {
    if (fire) {
      setTimeout(() => {
        fireGoldCoins();
      }, 500);
    }
  }, [fire, fireGoldCoins]);
  
  // Set up repeating confetti if enabled
  useEffect(() => {
    if (!repeat) return;
    
    const interval = setInterval(() => {
      fireGoldCoins();
    }, repeatInterval);
    
    return () => clearInterval(interval);
  }, [repeat, repeatInterval, fireGoldCoins]);
  
  return (
    <ReactCanvasConfetti
      // @ts-ignore - The types for react-canvas-confetti are incorrect
      refConfetti={getInstance}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 50
      }}
    />
  );
};

export default ConfettiCoins;