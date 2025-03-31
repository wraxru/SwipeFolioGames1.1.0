// Define types for the game features

export interface MetricQuestion {
  metric: string;
  companyValue: string | number;
  industryAverage: string | number;
  isGood: boolean;
  explanation: string;
  id?: string; // Optional ID for easier reference
}

export interface BoardRoomDecision {
  id: string;
  title: string;
  description: string;
  options: {
    id: string;
    text: string;
    impact: {
      name: string;
      change: number;
    }[];
  }[];
}

export interface GameReward {
  id: string;
  name: string;
  description: string;
  ticketCost: number;
  acquired: boolean;
  type: 'badge' | 'theme' | 'unlock';
  icon?: string;
}

export interface LevelRequirement {
  level: number;
  xpRequired: number;
  rewards: {
    tickets: number;
    description: string;
  };
}