import React from 'react';
import { InvestorSimulatorGame } from '@/components/investor-simulator-game';
import AppNavigation from '@/components/app-navigation';

export default function InvestorSimulatorPage() {
  return (
    <div>
      <AppNavigation />
      <InvestorSimulatorGame />
    </div>
  );
}