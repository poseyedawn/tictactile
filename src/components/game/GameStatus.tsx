
import React from 'react';
import { Player, GameStatus as StatusType } from '@/types/game';
import { cn } from '@/lib/utils';
import { X, Circle, Hourglass, Award, Equal } from 'lucide-react';

interface GameStatusProps {
  status: StatusType;
  winner: Player;
  currentPlayer: Player;
  aiThinking: boolean;
  winStreak: number;
  bestStreak: number;
  fastestWin: number | null;
}

const GameStatus: React.FC<GameStatusProps> = ({
  status,
  winner,
  currentPlayer,
  aiThinking,
  winStreak,
  bestStreak,
  fastestWin
}) => {
  const renderStatusMessage = () => {
    if (status === 'won') {
      return (
        <div className="flex items-center justify-center space-x-2 animate-fade-in">
          <Award className="text-[hsl(var(--win-line))]" />
          <span className="font-bold">
            {winner === 'X' ? 'You win!' : 'TORUK wins!'}
          </span>
        </div>
      );
    } else if (status === 'draw') {
      return (
        <div className="flex items-center justify-center space-x-2 animate-fade-in">
          <Equal className="text-[hsl(var(--draw-color))]" />
          <span className="font-bold">Draw!</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center space-x-2">
          <span>Current Turn: </span>
          {currentPlayer === 'X' ? (
            <X className="w-5 h-5 text-[hsl(var(--player-color))]" />
          ) : (
            <>
              <Circle 
                className={cn(
                  "w-5 h-5 text-[hsl(var(--ai-color))]",
                  aiThinking ? "thinking" : ""
                )} 
              />
              {aiThinking && <span className="text-sm italic">Thinking...</span>}
            </>
          )}
        </div>
      );
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto py-4 space-y-4">
      <div className="status-message text-center text-lg font-medium">
        {renderStatusMessage()}
      </div>
      
      {/* Stats display */}
      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div className="p-2 rounded-md bg-[hsl(var(--control-bg))] theme-transition">
          <div className="font-semibold">Win Streak</div>
          <div className="text-xl">{winStreak}</div>
        </div>
        
        <div className="p-2 rounded-md bg-[hsl(var(--control-bg))] theme-transition">
          <div className="font-semibold">Best Streak</div>
          <div className="text-xl">{bestStreak}</div>
        </div>
        
        <div className="p-2 rounded-md bg-[hsl(var(--control-bg))] theme-transition">
          <div className="font-semibold">Fastest Win</div>
          <div className="text-xl">
            {fastestWin ? `${fastestWin}s` : '-'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;

