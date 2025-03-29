export interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  roi: number; // Percentage
  trades: number;
  portfolioQuality: number; // 0-100 score
  referrals: number;
  isVerified?: boolean;
  rank?: number; // Current rank position
}

export const leaderboardUsers: LeaderboardUser[] = [
  {
    id: "lebron-james",
    name: "LeBron James",
    username: "KingJames",
    avatar: "/images/avatars/lebron-james.png",
    roi: 245.8,
    trades: 147,
    portfolioQuality: 98,
    referrals: 1482,
    isVerified: true,
  },
  {
    id: "value-buffet",
    name: "Warren B.",
    username: "ValueBuffet",
    avatar: "/images/avatars/default-1.png", 
    roi: 156.3,
    trades: 89,
    portfolioQuality: 94,
    referrals: 538,
    isVerified: true,
  },
  {
    id: "outsider-trading",
    name: "Michael Lewis",
    username: "OutsiderTrading123",
    avatar: "/images/avatars/default-2.png",
    roi: 128.7,
    trades: 213,
    portfolioQuality: 87,
    referrals: 347,
  },
  {
    id: "investor-4",
    name: "Sophia Chen",
    username: "SophiaInvests",
    avatar: "/images/avatars/default-3.png",
    roi: 97.5,
    trades: 76,
    portfolioQuality: 89,
    referrals: 124,
  },
  {
    id: "investor-5",
    name: "Alex Morgan",
    username: "GrowthSeeker",
    avatar: "/images/avatars/default-4.png",
    roi: 83.2,
    trades: 103,
    portfolioQuality: 81,
    referrals: 92,
  },
  {
    id: "investor-6",
    name: "David Kim",
    username: "StockSurfer",
    avatar: "/images/avatars/default-5.png",
    roi: 76.8,
    trades: 158,
    portfolioQuality: 77,
    referrals: 63,
  },
  {
    id: "investor-7",
    name: "Emma Watson",
    username: "SmartMoney",
    avatar: "/images/avatars/default-6.png",
    roi: 65.4,
    trades: 67,
    portfolioQuality: 82,
    referrals: 51,
  },
  {
    id: "investor-8",
    name: "Tyler Johnson",
    username: "InvestNinja",
    avatar: "/images/avatars/default-7.png",
    roi: 53.9,
    trades: 91,
    portfolioQuality: 71,
    referrals: 38,
  },
  {
    id: "investor-9",
    name: "Zoe Rodriguez",
    username: "ZoeRoadToWealth",
    avatar: "/images/avatars/default-8.png",
    roi: 42.7,
    trades: 58,
    portfolioQuality: 68,
    referrals: 24,
  },
  {
    id: "investor-10",
    name: "James Miller",
    username: "FutureRich",
    avatar: "/images/avatars/default-9.png",
    roi: 36.5,
    trades: 42,
    portfolioQuality: 63,
    referrals: 15,
  },
  {
    id: "current-user",
    name: "Belford & Co",
    username: "Belford&Co",
    avatar: "/images/avatars/belford-avatar.png",
    roi: 21.8, // Will be dynamically calculated from portfolio context
    trades: 12, // Will be dynamically calculated from portfolio context
    portfolioQuality: 59, // Will be dynamically calculated from portfolio context 
    referrals: 3,
  }
];

// Function to get leaderboard data with rankings applied
export function getLeaderboardData(): LeaderboardUser[] {
  // Sort by ROI (highest first)
  const sortedUsers = [...leaderboardUsers].sort((a, b) => b.roi - a.roi);
  
  // Add rank property
  return sortedUsers.map((user, index) => ({
    ...user,
    rank: index + 1
  }));
}

// Function to get top N users for the competition tracker
export function getTopUsers(count: number = 3): LeaderboardUser[] {
  return getLeaderboardData().slice(0, count);
}

// Function to get current user's rank and data
export function getCurrentUserRank(): LeaderboardUser | undefined {
  const rankedData = getLeaderboardData();
  return rankedData.find(user => user.id === "current-user");
}