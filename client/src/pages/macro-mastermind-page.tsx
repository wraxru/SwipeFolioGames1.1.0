import React from 'react';
import { MacroMastermindGame } from '@/components/macro-mastermind-game';
import AppNavigation from '@/components/app-navigation';

export default function MacroMastermindPage() {
  return (
    <div>
      <AppNavigation />
      <MacroMastermindGame />
    </div>
  );
}