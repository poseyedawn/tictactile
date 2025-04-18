
import React, { useEffect, useState } from 'react';
import { Player } from '@/types/game';
import { cn } from '@/lib/utils';
import { X, Circle } from 'lucide-react';

interface CellProps {
  value: Player;
  onClick: () => void;
  index: number;
  disabled: boolean;
  isWinningCell: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, index, disabled, isWinningCell }) => {
  const [animate, setAnimate] = useState(false);
  
  // Animation on value change
  useEffect(() => {
    if (value) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [value]);
  
  return (
    <button
      className={cn(
        "cell w-full h-full rounded-md flex items-center justify-center bg-[hsl(var(--control-bg))] theme-transition",
        "border-2 border-[hsl(var(--grid-border))]",
        "hover:bg-[hsl(var(--grid-hover))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-2",
        disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer",
        isWinningCell ? "win-animation" : ""
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Cell ${index + 1}, ${value || 'empty'}`}
    >
      <div 
        className={cn(
          "cell-content w-3/4 h-3/4 flex items-center justify-center",
          animate ? "animate-bounce-in" : "",
          value === 'X' ? "token-x" : "",
          value === 'O' ? "token-o" : ""
        )}
      >
        {value === 'X' && (
          <X className="w-full h-full glow-x token" strokeWidth={3} />
        )}
        {value === 'O' && (
          <Circle className="w-full h-full glow-o token" strokeWidth={3} />
        )}
      </div>
    </button>
  );
};

export default Cell;
