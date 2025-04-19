
import { useEffect } from 'react';
import { GameState, Player } from '@/types/game';
import { checkWinner, checkDraw, getAIMove } from '@/utils/gameUtils';
import { sounds } from '@/utils/audioUtils';

export const useGameMoves = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  setShowConfetti: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Handle AI moves
  useEffect(() => {
    let aiMoveTimer: NodeJS.Timeout;

    if (gameState.currentPlayer === 'O' && gameState.status === 'playing') {
      const thinkingTime = Math.random() * 600 + 400;

      aiMoveTimer = setTimeout(() => {
        const aiMoveIndex = getAIMove(gameState.board, gameState.difficulty);
        handleMove(aiMoveIndex, 'O');
      }, thinkingTime);
    }

    return () => clearTimeout(aiMoveTimer);
  }, [gameState.currentPlayer, gameState.status, gameState.board, gameState.difficulty]);

  const handleMove = (index: number, player: Player) => {
    if (player === 'O') {
      sounds.playTap(gameState.soundEnabled);
    }

    const newBoard = [...gameState.board];
    newBoard[index] = player;

    const { winner, winLine } = checkWinner(newBoard);
    const isDraw = winner === null && checkDraw(newBoard);

    let newStatus = gameState.status;
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

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: player === 'X' ? 'O' : 'X',
      status: newStatus,
      winner: newWinner,
      winLine,
      moveCount: prev.moveCount + 1,
      aiThinking: newStatus === 'playing' && player === 'X',
      winStreak: newWinStreak,
      bestStreak: newBestStreak
    }));
  };

  const handlePlayerMove = (index: number) => {
    if (
      gameState.board[index] !== null ||
      gameState.status !== 'playing' ||
      gameState.currentPlayer !== 'X'
    ) {
      return;
    }

    sounds.playTap(gameState.soundEnabled);
    handleMove(index, 'X');
  };

  return { handlePlayerMove };
};
