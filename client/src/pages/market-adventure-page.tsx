import React from 'react';
import { MarketAdventureGame } from '@/components/market-adventure-game';
import AppNavigation from '@/components/app-navigation';

export default function MarketAdventurePage() {
  return (
    <div>
      <AppNavigation />
      <MarketAdventureGame />
    </div>
  );
}