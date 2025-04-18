
import React from 'react';
import { Button } from '@/components/ui/button';
import { Difficulty, Theme } from '@/types/game';
import { cn } from '@/lib/utils';
import { RefreshCw, Volume2, VolumeX, Sun, Moon, Zap, Lock } from 'lucide-react';

interface GameControlsProps {
  onNewGame: () => void;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  onChangeTheme: (theme: Theme) => void;
  onToggleSound: () => void;
  difficulty: Difficulty;
  theme: Theme;
  soundEnabled: boolean;
  availableThemes: Theme[];
  gameActive: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onChangeDifficulty,
  onChangeTheme,
  onToggleSound,
  difficulty,
  theme,
  soundEnabled,
  availableThemes,
  gameActive
}) => {
  const difficultyOptions: Difficulty[] = ['easy', 'medium', 'hard'];
  const themeOptions: [Theme, React.ReactNode][] = [
    ['light', <Sun key="light" className="w-5 h-5" />],
    ['dark', <Moon key="dark" className="w-5 h-5" />],
    ['neon', <Zap key="neon" className="w-5 h-5" />],
    ['retro', <span key="retro" className="text-xs">Retro</span>],
    ['watercolor', <span key="water" className="text-xs">Water</span>]
  ];
  
  return (
    <div className="game-controls w-full max-w-md mx-auto mt-6 space-y-4">
      {/* New Game Button */}
      <div className="flex justify-center">
        <Button
          onClick={onNewGame}
          variant="default"
          size="lg"
          className={cn(
            "bg-[hsl(var(--button-bg))] text-[hsl(var(--button-text))]",
            "hover:bg-[hsl(var(--button-hover))] transition-colors",
            "flex items-center gap-2"
          )}
        >
          <RefreshCw className="w-5 h-5" />
          New Game
        </Button>
      </div>
      
      {/* Difficulty Selector */}
      <div className="flex flex-col space-y-2">
        <h3 className="text-center font-medium">Difficulty</h3>
        <div className="flex justify-center space-x-2">
          {difficultyOptions.map((d) => (
            <Button
              key={d}
              variant={difficulty === d ? "default" : "outline"}
              size="sm"
              onClick={() => onChangeDifficulty(d)}
              disabled={gameActive}
              className={cn(
                difficulty === d ? "bg-[hsl(var(--button-bg))] text-[hsl(var(--button-text))]" : "",
                "capitalize"
              )}
            >
              {d}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Theme Selector */}
      <div className="flex flex-col space-y-2">
        <h3 className="text-center font-medium">Theme</h3>
        <div className="flex justify-center flex-wrap gap-2">
          {themeOptions.map(([t, icon]) => {
            const isAvailable = availableThemes.includes(t);
            
            return (
              <Button
                key={t}
                variant={theme === t ? "default" : "outline"}
                size="sm"
                onClick={() => isAvailable && onChangeTheme(t)}
                disabled={!isAvailable}
                className={cn(
                  theme === t ? "bg-[hsl(var(--button-bg))] text-[hsl(var(--button-text))]" : "",
                  !isAvailable && "opacity-50 cursor-not-allowed"
                )}
                title={isAvailable ? t : `${t} (Locked)`}
              >
                {isAvailable ? (
                  icon
                ) : (
                  <div className="flex items-center gap-1">
                    {icon}
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Sound Toggle */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleSound}
          className={cn(
            "flex items-center gap-2",
            soundEnabled ? "bg-[hsl(var(--button-bg))] text-[hsl(var(--button-text))]" : ""
          )}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
          {soundEnabled ? "Sound On" : "Sound Off"}
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
