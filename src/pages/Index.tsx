
import React from 'react';
import Game from '@/components/game/Game';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 bg-[hsl(var(--game-background))]">
      <h1 className="text-3xl font-bold mb-6 text-center">Tic-Tac-Toe</h1>
      <Game />
      <div className="mt-8 text-sm text-center opacity-70 max-w-md">
        <p>Win games to unlock new themes! Play against the AI with different difficulty levels.</p>
      </div>
    </div>
  );
};

export default Index;
