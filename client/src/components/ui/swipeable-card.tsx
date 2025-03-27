import { useState } from "react";
import { Card } from "@shared/schema"; // Ensure this path is correct for your project
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button"; // Ensure this path is correct
import { ArrowRight, LightbulbIcon } from "lucide-react";

interface SwipeableCardProps {
  card: Card;
  onNextCard: () => void;
  // Optional: Add props for investment logic if needed later
  // onInvest?: () => Promise<boolean>; // Example: returns true on success
}

export default function SwipeableCard({ card, onNextCard }: SwipeableCardProps) {
  // State to manage the visual animation direction ('left' or 'right')
  const [swipeDirection, setSwipeDirection] = useState<null | "left" | "right">(null);
  // State to prevent multiple actions during animation
  const [isAnimating, setIsAnimating] = useState(false);
  // State to display temporary status text like "Skipped"
  const [statusIndicator, setStatusIndicator] = useState<string | null>(null);

  // --- Triggers the card swipe animation ---
  const triggerSwipeAnimation = (
    direction: "left" | "right", // The visual direction the card moves off-screen
    statusText: string | null, // Text to show temporarily (e.g., "Skipped")
    callback?: () => void // Action to perform after animation (e.g., onNextCard)
  ) => {
    if (isAnimating) return; // Prevent double triggers

    setIsAnimating(true);
    setSwipeDirection(direction); // Start animation
    setStatusIndicator(statusText); // Show status text if provided

    // After animation duration, reset states and execute callback
    setTimeout(() => {
      setSwipeDirection(null);
      setIsAnimating(false);
      setStatusIndicator(null); // Hide status text
      if (callback) {
        callback(); // Go to next card, etc.
      }
    }, 350); // Slightly longer timeout to ensure text is visible during fade
  };

  // --- Handles the end of a drag gesture ---
  const handleDragEnd = (_: any, info: { offset: { x: number; y: number } }) => {
    if (isAnimating) return; // Ignore if already animating

    const swipeThreshold = 100; // How far the user must drag

    // *** Physical Drag Towards LEFT -> SKIP Action ***
    // (Moving finger center to left = "swipe right" like Tinder)
    if (info.offset.x < -swipeThreshold) {
      console.log("Action: Skip (Physically dragged left, swiped right in Tinder terms)");
      // Card animates LEFT, show "Skipped", then call onNextCard
      triggerSwipeAnimation("left", "Skipped", onNextCard);
    }
    // *** Physical Drag Towards RIGHT -> CONTINUE/INVEST Action ***
    // (Moving finger center to right = "swipe left" like Tinder)
    else if (info.offset.x > swipeThreshold) {
      console.log("Action: Continue/Invest (Physically dragged right, swiped left in Tinder terms)");
      // Card animates RIGHT, show no status text (or maybe "Confirmed"), then call onNextCard
      // NOTE: Adjust this if drag-right shouldn't automatically advance
      triggerSwipeAnimation("right", null, onNextCard);
      // Example if drag-right only animates, button confirms:
      // triggerSwipeAnimation("right", null); // Animate only
    }
    // Else: Drag didn't cross threshold, card snaps back (handled by Framer Motion)
  };

  // --- Handles the button click (Confirm/Continue/Invest) ---
  const handleButtonClick = () => {
    if (isAnimating) return;
    console.log("Action: Button Confirm (Continue/Invest)");
    // Card animates LEFT, show no status text (or "Confirmed"), then call onNextCard
    // TODO: Add specific logic here if it's an "Invest" button
    // e.g., call props.onInvest?.().then(success => success && triggerSwipeAnimation(...))
    triggerSwipeAnimation("left", null, onNextCard);
  };

  // --- Renders the specific content based on card type ---
  const getCardContent = () => {
    // (Your existing getCardContent function - no changes needed from previous version)
    // Make sure it includes robust rendering for 'info', 'data-viz', and maybe error cases
    if (card.type === 'info') {
      return (
        <>
          <div className="prose max-w-none"> {/* Added max-w-none for prose */}
            <p className="text-gray-700 mb-4">{card.content.text}</p> {/* Added margin */}

            {/* Models Section */}
            {card.content.models && card.content.models.length > 0 && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                {card.content.models.map((model, index) => (
                  <div key={index} className="flex items-start mb-3 last:mb-0">
                     {/* Basic icon placeholder - replace with actual icon library if available */}
                    <span className={`text-secondary-500 text-xl mr-3 mt-0.5 w-6 h-6 flex items-center justify-center bg-secondary-100 rounded`}>
                       {model.icon ? model.icon.charAt(0).toUpperCase() : '?'}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-800">{model.name}</h4>
                      <p className="text-sm text-gray-600">{model.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Fun Fact Section */}
            {card.content.funFact && (
              <div className="mt-6 border-t pt-4"> {/* Added separator */}
                <h4 className="font-medium text-gray-800 text-sm mb-1">Fun Fact</h4> {/* Adjusted size */}
                <p className="text-sm text-gray-600 italic">{card.content.funFact}</p>
              </div>
            )}
          </div>
        </>
      );
    } else if (card.type === 'data-viz') {
      return (
         <>
           {/* Revenue Breakdown Section */}
           <div className="mb-6">
             <h4 className="font-medium text-gray-800 mb-3">Big Tech Revenue Breakdown</h4>
             <div className="space-y-4"> {/* Use space-y for spacing */}
               {card.content.companies?.map((company, index) => (
                 <div key={index} className="bg-gray-50 p-3 rounded-lg"> {/* Adjusted padding */}
                   <div className="flex justify-between items-center mb-2"> {/* Increased margin */}
                     <span className="text-sm font-semibold">{company.name}</span> {/* Bolder name */}
                     <span className="text-xs text-gray-500 font-medium">{company.revenue}</span>
                   </div>
                   <div className="flex w-full h-5 rounded-full overflow-hidden bg-gray-200 mb-1.5"> {/* Adjusted height/margin */}
                     {company.segments.map((segment, idx) => (
                       <div
                         key={idx}
                         className={segment.color || 'bg-gray-400'}
                         style={{ width: `${segment.percentage}%` }}
                         title={`${segment.name} (${segment.percentage}%)`}
                       ></div>
                     ))}
                   </div>
                   <div className="flex text-xs text-gray-600 mt-1 justify-start flex-wrap gap-x-3 gap-y-1"> {/* Adjusted style/gap */}
                     {company.segments.map((segment, idx) => (
                       <div key={idx} className="flex items-center">
                         <span className={`w-2 h-2 rounded-full mr-1 ${segment.color || 'bg-gray-400'}`}></span>
                         <span>{segment.name} {segment.percentage}%</span>
                       </div>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Insight Section */}
           <div className="prose max-w-none mt-6 border-t pt-4"> {/* Separator */}
             <h4 className="font-medium text-gray-800">Key Insight</h4>
             <p className="text-sm text-gray-600 mb-3">{card.content.insight}</p>

             {card.content.keyPoint && (
                <div className="bg-primary-50 p-3 rounded-lg border border-primary-200"> {/* Added border */}
                 <p className="text-sm text-primary-700 font-medium flex items-center">
                   <LightbulbIcon className="mr-2 text-primary-500 flex-shrink-0" size={16} />
                   <span>{card.content.keyPoint}</span>
                 </p>
               </div>
             )}
           </div>
         </>
      );
    }

    // Fallback for unsupported card types
    return <p className="text-red-500 p-4">Error: Unsupported card type "{card.type}"</p>;
  };


  // --- Render the swipeable card component ---
  return (
    <motion.div
      // Core styling - absolute positioning is key for stacking/swiping
      className="absolute bg-white rounded-xl overflow-hidden shadow-lg w-[85%] max-w-lg h-[70%] cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }} // Prevents page scroll while dragging card on touch devices

      // Drag properties
      drag="x" // Enable horizontal dragging
      dragConstraints={{ left: 0, right: 0 }} // Snap back if not dragged past threshold
      dragElastic={0.5} // Resistance when dragging past constraints

      // Drag gesture handler
      onDragEnd={handleDragEnd}

      // Animation properties based on swipeDirection state
      animate={{
        // Card moves LEFT (-x) for 'left' swipe, RIGHT (+x) for 'right' swipe
        x: swipeDirection === "left" ? "-120%" : swipeDirection === "right" ? "120%" : "0%",
        // Rotate opposite to the direction of movement for a tilted effect
        rotate: swipeDirection === "left" ? -8 : swipeDirection === "right" ? 8 : 0,
        // Fade out when swiping
        opacity: swipeDirection ? 0 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }} // Spring animation for smoother feel

      // Key prop helps React differentiate cards if they re-render with new data
      key={card.id || card.title} // Assuming card has a unique id or title
    >
      {/* Container for card content + status indicator */}
      <div className="h-full w-full flex flex-col relative"> {/* Added relative positioning */}

        {/* --- Status Indicator Bubble ("Skipped") --- */}
        <AnimatePresence>
          {statusIndicator && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none
                         bg-black bg-opacity-75 text-white text-base font-semibold px-5 py-2 rounded-lg shadow-md" // Style the bubble
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }} // Fades out when statusIndicator becomes null
              transition={{ duration: 0.2 }} // Quick fade/scale animation
            >
              {statusIndicator}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Card Header --- */}
        <div className={`flex-shrink-0 px-5 py-4 bg-gradient-to-r ${
            card.type === 'info' ? 'from-blue-500 to-blue-600' : // Example: Blue for info
            card.type === 'data-viz' ? 'from-purple-500 to-purple-600' : // Example: Purple for data-viz
            'from-gray-500 to-gray-600' // Default
          }`}>
          <h3 className="text-white font-semibold text-lg truncate">{card.title}</h3> {/* Added truncate */}
          <p className="text-blue-100 text-sm opacity-90 truncate">{card.subtitle}</p> {/* Adjusted color/truncate */}
        </div>

        {/* --- Card Content (Scrollable) --- */}
        <div className="flex-1 p-5 overflow-y-auto"> {/* Ensure vertical scroll */}
          {getCardContent()}
        </div>

        {/* --- Card Footer (Action Button) --- */}
        <div className="flex-shrink-0 p-4 bg-gray-50 border-t border-gray-200">
          <Button
            onClick={handleButtonClick}
            className="w-full py-2.5 text-base font-medium rounded-lg
                       bg-gradient-to-r from-blue-500 to-blue-600 text-white
                       hover:from-blue-600 hover:to-blue-700
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       disabled:opacity-50" // Nicer button style + disabled state
            disabled={isAnimating} // Disable while animating
          >
            {/* TODO: Change text dynamically? "Invest Now" vs "Continue" */}
            <span>Continue</span>
            <ArrowRight className="inline ml-2" size={18} /> {/* Use inline for better alignment */}
          </Button>
        </div>

      </div>
    </motion.div>
  );
}