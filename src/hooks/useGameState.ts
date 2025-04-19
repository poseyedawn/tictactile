
import { useState, useEffect } from 'react';
import { GameState, Difficulty, Theme, Player } from '@/types/game';
import { checkWinner, checkDraw, getAIMove, saveGameState, loadGameState } from '@/utils/gameUtils';
import { sounds } from '@/utils/audioUtils';

const INITIAL_STATE: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  status: 'playing',
  winner: null,
  winLine: null,
  moveCount: 0,
  difficulty: 'medium',
  aiThinking: false,
  theme: 'light',
  soundEnabled: true,
  availableThemes: ['light', 'dark', 'neon'],
  winStreak: 0,
  bestStreak: 0,
  fastestWin: null
};

const STORAGE_KEY = 'tic-tac-toe-game-state';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  // Initialize game state from storage
  useEffect(() => {
    const savedState = loadGameState<GameState>(STORAGE_KEY, INITIAL_STATE);
    setGameState(savedState);
  }, []);

  // Save game state to storage when it changes
  useEffect(() => {
    saveGameState(STORAGE_KEY, gameState);
  }, [gameState]);

  // Track game time for fastest win
  useEffect(() => {
    if (gameState.status === 'playing' && gameState.moveCount === 1 && gameState.currentPlayer === 'O') {
      setGameStartTime(Date.now());
    }

    if (gameState.status === 'won' && gameState.winner === 'X' && gameStartTime) {
      const gameTimeSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
      const currentFastest = gameState.fastestWin;

      if (currentFastest === null || gameTimeSeconds < currentFastest) {
        setGameState(prev => ({ ...prev, fastestWin: gameTimeSeconds }));
      }

      setGameStartTime(null);
    }
  }, [gameState.status, gameState.moveCount, gameState.currentPlayer, gameStartTime]);

  // Check for unlockable themes
  useEffect(() => {
    const { winStreak, availableThemes } = gameState;

    if (winStreak >= 3 && !availableThemes.includes('retro')) {
      const updatedThemes = [...availableThemes, 'retro'] as Theme[];
      setGameState(prev => ({ ...prev, availableThemes: updatedThemes }));
      sounds.playUnlock(gameState.soundEnabled);
    }

    if (winStreak >= 5 && !availableThemes.includes('watercolor')) {
      const updatedThemes = [...availableThemes, 'watercolor'] as Theme[];
      setGameState(prev => ({ ...prev, availableThemes: updatedThemes }));
      sounds.playUnlock(gameState.soundEnabled);
    }
  }, [gameState.winStreak]);

  return {
    gameState,
    setGameState,
    showConfetti,
    setShowConfetti,
    gameStartTime,
    setGameStartTime,
  };
};
