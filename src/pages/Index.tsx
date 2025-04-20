import React from 'react';
import Game from '@/components/game/Game';
const Index = () => {
  return <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 bg-[hsl(var(--game-background))] bg-slate-950">
      <h1 className="text-3xl font-bold mb-6 text-center">Tic-Tac-Tile</h1>
      <Game />
      <div className="mt-8 text-sm text-center opacity-70 max-w-md">
        <p className="text-slate-50">Win consecutive games to unlock new themes! Compete against the AI at various difficulty levels.</p>
      </div>
    </div>;
};
export default Index;