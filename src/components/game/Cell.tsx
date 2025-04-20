
import React, { useEffect, useState } from 'react';
import { Player } from '@/types/game';
import { cn } from '@/lib/utils';
import { X, Circle, Fish, Flame } from 'lucide-react';

interface CellProps {
  value: Player;
  onClick: () => void;
  index: number;
  disabled: boolean;
  isWinningCell: boolean;
  theme?: string; // Pass current theme, optional for retro-compatibility
}

// Pufferfish SVG (not in lucide, so let's inline one simple SVG)
const Pufferfish = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <circle cx="16" cy="16" r="10" fill="#9fd7ff" stroke="#1976d2" strokeWidth="2"/>
    <ellipse cx="12.5" cy="14" rx="1.5" ry="2" fill="#fff" />
    <ellipse cx="19.5" cy="14" rx="1.5" ry="2" fill="#fff" />
    <circle cx="12.5" cy="15" r=".75" fill="#333" />
    <circle cx="19.5" cy="15" r=".75" fill="#333" />
    <ellipse cx="16" cy="20" rx="4" ry="2" fill="#b3e1ff" />
    <ellipse cx="16" cy="18.2" rx="1.5" ry=".7" fill="#1976d2" opacity="0.12"/>
  </svg>
);

// Firewood X SVG (custom X for fire mode)
const FirewoodX = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 28 28" className={className} fill="none">
    <rect x="12" y="6" width="4" height="16" rx="2" fill="#d97706" transform="rotate(45 14 14)" />
    <rect x="12" y="6" width="4" height="16" rx="2" fill="#b91c1c" transform="rotate(-45 14 14)" />
    <rect x="13" y="13" width="2" height="2" rx="1" fill="#fff5c2" />
  </svg>
);

const Cell: React.FC<CellProps> = ({ value, onClick, index, disabled, isWinningCell, theme }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (value) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [value]);

  // For water mode: fish (X), pufferfish (O)
  // For fire mode: firewood X (X), flame (O)
  // For other modes: default icons
  let displayIcon: React.ReactNode = null;
  if (theme === "water") {
    if (value === "X") {
      displayIcon = <Fish className="w-full h-full token-water-x" strokeWidth={2.8} />;
    } else if (value === "O") {
      displayIcon = <Pufferfish className="w-full h-full token-water-o" />;
    }
  } else if (theme === "fire") {
    if (value === "X") {
      displayIcon = <FirewoodX className="w-full h-full token-fire-x" />;
    } else if (value === "O") {
      displayIcon = <Flame className="w-full h-full token-fire-o" strokeWidth={2.6} />;
    }
  } else {
    if (value === "X") {
      displayIcon = <X className="w-full h-full glow-x token" strokeWidth={3} />;
    } else if (value === "O") {
      displayIcon = <Circle className="w-full h-full glow-o token" strokeWidth={3} />;
    }
  }

  // Apply ripple effect in water mode
  const cellClass =
    theme === "water"
      ? "cell-water ripple"
      : theme === "fire"
      ? "cell-fire"
      : "";

  return (
    <button
      className={cn(
        "cell w-full h-full rounded-md flex items-center justify-center theme-transition",
        "border-2",
        cellClass,
        // Borders and hover are kept from root level, override only where needed
        !theme || theme === "light" || theme === "water"
          ? "bg-[hsl(var(--control-bg))] border-[hsl(var(--grid-border))]"
          : "",
        theme === "fire" ? "bg-[#1a0900] border-[#fe6101]" : "",
        theme === "neon" ? "bg-black border-cyan-500" : "",
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
        {displayIcon}
      </div>
    </button>
  );
};

export default Cell;
