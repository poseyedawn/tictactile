
import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import GameStatus from './GameStatus';
import GameControls from './GameControls';
import Confetti from './Confetti';
import { GameState, Player, Difficulty, Theme } from '@/types/game';
import { checkWinner, checkDraw, getAIMove, saveGameState, loadGameState } from '@/utils/gameUtils';
import { sounds, initializeAudio } from '@/utils/audioUtils';

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

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Initialize game from local storage and setup audio
  useEffect(() => {
    const savedState = loadGameState<GameState>(STORAGE_KEY, INITIAL_STATE);
    setGameState(savedState);
    initializeAudio();
    
    // Apply theme from saved state
    document.documentElement.classList.remove('dark', 'neon');
    if (savedState.theme === 'dark' || savedState.theme === 'neon') {
      document.documentElement.classList.add(savedState.theme);
    }
  }, []);
  
  // Save game state to local storage when it changes
  useEffect(() => {
    saveGameState(STORAGE_KEY, gameState);
    
    // Apply theme changes
    document.documentElement.classList.remove('dark', 'neon');
    if (gameState.theme === 'dark' || gameState.theme === 'neon') {
      document.documentElement.classList.add(gameState.theme);
    }
  }, [gameState]);
  
  // Check for unlockable themes
  useEffect(() => {
    const { winStreak, availableThemes } = gameState;
    
    // Unlock "Retro" theme after 3 wins
    if (winStreak >= 3 && !availableThemes.includes('retro')) {
      const updatedThemes = [...availableThemes, 'retro'] as Theme[];
      setGameState(prev => ({ ...prev, availableThemes: updatedThemes }));
      sounds.playUnlock(gameState.soundEnabled);
    }
    
    // Unlock "Watercolor" theme after 5 wins
    if (winStreak >= 5 && !availableThemes.includes('watercolor')) {
      const updatedThemes = [...availableThemes, 'watercolor'] as Theme[];
      setGameState(prev => ({ ...prev, availableThemes: updatedThemes }));
      sounds.playUnlock(gameState.soundEnabled);
    }
  }, [gameState.winStreak]);
  
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
  
  // Handle player move
  const handleCellClick = useCallback((index: number) => {
    if (
      gameState.board[index] !== null ||
      gameState.status !== 'playing' ||
      gameState.currentPlayer !== 'X'
    ) {
      return;
    }
    
    sounds.playTap(gameState.soundEnabled);
    
    // Update board with player's move
    const newBoard = [...gameState.board];
    newBoard[index] = 'X';
    
    // Check for win or draw
    const { winner, winLine } = checkWinner(newBoard);
    const isDraw = winner === null && checkDraw(newBoard);
    
    let newStatus: GameState['status'] = gameState.status;
    let newWinner = gameState.winner;
    let newWinStreak = gameState.winStreak;
    let newBestStreak = gameState.bestStreak;
    
    if (winner) {
      newStatus = 'won';
      newWinner = winner;
      
      if (winner === 'X') {
        newWinStreak = gameState.winStreak + 1;
        newBestStreak = Math.max(newWinStreak, gameState.bestStreak);
        setShowConfetti(true);
        sounds.playWin(gameState.soundEnabled);
      } else {
        newWinStreak = 0;
        sounds.playDraw(gameState.soundEnabled);
      }
    } else if (isDraw) {
      newStatus = 'draw';
      newWinStreak = 0;
      sounds.playDraw(gameState.soundEnabled);
    }
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: 'O',
      status: newStatus,
      winner: newWinner,
      winLine,
      moveCount: prev.moveCount + 1,
      aiThinking: newStatus === 'playing',
      winStreak: newWinStreak,
      bestStreak: newBestStreak
    }));
  }, [gameState]);
  
  // Handle AI move
  useEffect(() => {
    let aiMoveTimer: NodeJS.Timeout;
    
    if (gameState.currentPlayer === 'O' && gameState.status === 'playing') {
      // Add a delay to simulate AI "thinking"
      const thinkingTime = Math.random() * 600 + 400; // 400-1000ms
      
      aiMoveTimer = setTimeout(() => {
        const aiMoveIndex = getAIMove(gameState.board, gameState.difficulty);
        const newBoard = [...gameState.board];
        newBoard[aiMoveIndex] = 'O';
        
        // Check for win or draw
        const { winner, winLine } = checkWinner(newBoard);
        const isDraw = winner === null && checkDraw(newBoard);
        
        let newStatus: GameState['status'] = gameState.status;
        let newWinner = gameState.winner;
        let newWinStreak = gameState.winStreak;
        
        if (winner) {
          newStatus = 'won';
          newWinner = winner;
          newWinStreak = 0;
          sounds.playTap(gameState.soundEnabled);
          sounds.playDraw(gameState.soundEnabled);
        } else if (isDraw) {
          newStatus = 'draw';
          newWinStreak = 0;
          sounds.playTap(gameState.soundEnabled);
          sounds.playDraw(gameState.soundEnabled);
        } else {
          sounds.playTap(gameState.soundEnabled);
        }
        
        // Update game state
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: 'X',
          status: newStatus,
          winner: newWinner,
          winLine,
          moveCount: prev.moveCount + 1,
          aiThinking: false,
          winStreak: newWinStreak
        }));
      }, thinkingTime);
    }
    
    return () => clearTimeout(aiMoveTimer);
  }, [gameState.currentPlayer, gameState.status, gameState.board, gameState.difficulty]);
  
  // Reset confetti after animation
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);
  
  // Start a new game
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
  
  // Change difficulty
  const handleChangeDifficulty = (difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, difficulty }));
  };
  
  // Change theme
  const handleChangeTheme = (theme: Theme) => {
    setGameState(prev => ({ ...prev, theme }));
  };
  
  // Toggle sound
  const handleToggleSound = () => {
    setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };
  
  const isGameActive = gameState.status === 'playing' && gameState.moveCount > 0;
  
  return (
    <div className="w-full max-w-md mx-auto p-4 theme-transition">
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
        onCellClick={handleCellClick}
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
