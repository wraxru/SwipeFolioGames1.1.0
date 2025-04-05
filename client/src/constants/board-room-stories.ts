import type { EnhancedBoardRoomDecision } from '@/types/game';

export const BOARD_ROOM_STORIES: Record<string, string> = {
  "Company Establishment": `As the newly appointed CEO of your company, you stand at the threshold of an exciting journey. The boardroom is filled with anticipation as you prepare to make your first major decisions. The company's future rests on your ability to balance growth, stability, and innovation. Each choice you make will shape the company's culture, financial health, and market position. The board members look to you for leadership, while employees await your vision for the future. This is your moment to establish the foundation that will determine whether your company becomes an industry leader or struggles to find its footing.`,

  "Market Entry": `The market research team has presented their findings, and the opportunity is clear. Your company stands at a critical juncture - the moment to make your mark in the industry. Competitors are watching, customers are waiting, and investors are eager to see your strategy. The decisions you make now will determine whether your company becomes a market leader or gets lost in the crowd. Every choice carries weight, from pricing strategy to distribution channels, from marketing approach to customer acquisition. The market is ready - are you?`,

  "Growth Phase": `Success has brought new challenges. Your company is growing faster than anticipated, and the board is divided on how to handle this momentum. Some push for aggressive expansion, while others advocate for consolidation and optimization. The market is responding positively to your products, but maintaining quality while scaling is becoming increasingly complex. Your decisions now will determine whether this growth is sustainable or if it leads to overextension. The team looks to you for direction - will you seize the moment or proceed with caution?`,

  "Market Leadership": `Your company has emerged as a market leader, but maintaining this position requires constant innovation and strategic thinking. Competitors are watching your every move, ready to capitalize on any misstep. The board is concerned about complacency and pushing for bold moves to stay ahead. Market dynamics are shifting, and customer expectations are evolving. Your decisions now will determine whether your company continues to lead or becomes a cautionary tale of lost opportunity. The industry looks to you for direction - will you redefine the market or defend your position?`,

  "Crisis Management": `A perfect storm of challenges has hit the market. Economic uncertainty, supply chain disruptions, and shifting consumer behavior have created unprecedented challenges. The board is divided on how to respond, and employees are looking to you for stability and direction. Your decisions now will test your leadership and determine whether your company emerges stronger or succumbs to the pressure. The crisis is real, but so is the opportunity to demonstrate resilience and strategic thinking. How will you navigate these turbulent waters?`,

  "Innovation & Transformation": `The industry is undergoing a fundamental transformation, driven by technological advances and changing consumer expectations. Your company stands at a crossroads - adapt and thrive, or resist and decline. The board is pushing for bold innovation, while some stakeholders urge caution. The market is watching to see if you can lead this transformation or if you'll be left behind. Your decisions now will determine whether your company becomes a pioneer of change or a relic of the past. The future is here - will you shape it or be shaped by it?`,

  "Global Expansion": `International markets present both tremendous opportunity and significant risk. Your company has the chance to become a global player, but each market brings unique challenges and cultural considerations. The board is eager to expand, but concerns about overextension and cultural missteps are real. Your decisions now will determine whether your company becomes a global leader or struggles with the complexities of international business. The world is waiting - will you take the leap?`,

  "Sustainability & Social Impact": `Stakeholders are demanding more than just financial returns. Environmental concerns, social responsibility, and corporate governance are now critical to your company's success. The board is pushing for meaningful change, but balancing these initiatives with financial performance is challenging. Your decisions now will determine whether your company becomes a leader in sustainable business or falls behind in this new era of corporate responsibility. The future of business is changing - will you lead this transformation?`,

  "Digital Transformation": `The digital revolution is reshaping your industry, and your company must adapt or risk obsolescence. New technologies are emerging, customer expectations are evolving, and traditional business models are being disrupted. The board is divided on how aggressively to pursue digital initiatives, while some departments resist change. Your decisions now will determine whether your company becomes a digital leader or struggles to keep up with the pace of change. The digital future is here - will you embrace it?`,

  "Legacy & Succession": `As your tenure as CEO nears its conclusion, the focus shifts to ensuring a lasting legacy and smooth transition. The board is concerned about maintaining momentum while preparing for new leadership. Employees are anxious about the future, and stakeholders are watching closely. Your decisions now will determine whether your company continues to thrive under new leadership or struggles with the transition. The time has come to cement your legacy - how will you be remembered?`
};

// Helper function to get a story for a stage
export function getBoardRoomStory(stage: string): string {
  return BOARD_ROOM_STORIES[stage] || "A new chapter in your company's journey begins...";
}

// Helper function to enhance a decision with a story
export function enhanceDecisionWithStory(decision: EnhancedBoardRoomDecision): EnhancedBoardRoomDecision {
  return {
    ...decision,
    description: `${getBoardRoomStory(decision.stage)}\n\n${decision.description}`
  };
} 