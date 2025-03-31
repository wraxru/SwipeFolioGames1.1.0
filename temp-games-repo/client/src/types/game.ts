export interface GameState {
  score: number;
  level: number;
  xp: number;
  tickets: number;
  lastSaved: number;
}

export interface MetricQuestion {
  id: number;
  metric: string;
  explanation: string;
  companyValue: number;
  industryAverage: number;
  isGood: boolean;
}

export interface Stock {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: number;
  industry: string;
  description: string;
  tier: number;
  volatility: number;
}

export interface MarketEvent {
  type: "positive" | "negative";
  message: string;
  icon: JSX.Element;
  color: string;
}

export interface Decision {
  id: number;
  title: string;
  description: string;
  options: {
    text: string;
    effects: {
      value?: number;
      employees?: number;
      revenue?: number;
      happiness?: number;
      innovation?: number;
      reputation?: number;
    };
  }[];
  icon: JSX.Element;
}

export interface Company {
  name: string;
  value: number;
  employees: number;
  revenue: number;
  happiness: number;
  innovation: number;
  reputation: number;
} 