
import React, { useEffect } from 'react';
import Board from './Board';
import GameStatus from './GameStatus';
import GameControls from './GameControls';
import Confetti from './Confetti';
import { useGameState } from '@/hooks/useGameState';
import { useGameMoves } from '@/hooks/useGameMoves';
import { Difficulty, Theme } from '@/types/game';

const Game: React.FC = () => {
  const {
    gameState,
    setGameState,
    showConfetti,
    setShowConfetti
  } = useGameState();

  const { handlePlayerMove } = useGameMoves(gameState, setGameState, setShowConfetti);

  // Apply theme to document body
  useEffect(() => {
    // Remove all theme classes first
    document.body.classList.remove('light', 'dark', 'neon', 'retro', 'watercolor');
    // Add current theme class
    document.body.classList.add(gameState.theme);
  }, [gameState.theme]);

  // Reset confetti after animation
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleNewGame = () => {
    setGameState(prev => ({
      ...prev,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
      winLine: null,
      moveCount: 0,
      aiThinking: false
    }));
  };

  const handleChangeDifficulty = (difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, difficulty }));
  };

  const handleChangeTheme = (theme: Theme) => {
    setGameState(prev => ({ ...prev, theme }));
  };

  const handleToggleSound = () => {
    setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const isGameActive = gameState.status === 'playing' && gameState.moveCount > 0;

  return (
    <div className={`w-full max-w-md mx-auto p-4 theme-transition`}>
      <GameStatus 
        status={gameState.status}
        winner={gameState.winner}
        currentPlayer={gameState.currentPlayer}
        aiThinking={gameState.aiThinking}
        winStreak={gameState.winStreak}
        bestStreak={gameState.bestStreak}
        fastestWin={gameState.fastestWin}
      />
      
      <Board 
        board={gameState.board}
        winLine={gameState.winLine}
        onCellClick={handlePlayerMove}
        disabled={gameState.currentPlayer !== 'X' || gameState.status !== 'playing'}
        currentPlayer={gameState.currentPlayer}
      />
      
      <GameControls
        onNewGame={handleNewGame}
        onChangeDifficulty={handleChangeDifficulty}
        onChangeTheme={handleChangeTheme}
        onToggleSound={handleToggleSound}
        difficulty={gameState.difficulty}
        theme={gameState.theme}
        soundEnabled={gameState.soundEnabled}
        availableThemes={gameState.availableThemes}
        gameActive={isGameActive}
      />
      
      {showConfetti && <Confetti show={showConfetti} />}
    </div>
  );
};

export default Game;
