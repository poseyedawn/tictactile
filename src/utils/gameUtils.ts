
import { Board, Player, WinLine } from '@/types/game';

// Check if a player has won
export const checkWinner = (board: Board): { winner: Player; winLine: WinLine } => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winLine: { start: a, end: c } };
    }
  }
  return { winner: null, winLine: null };
};

// Check if the game is a draw
export const checkDraw = (board: Board): boolean => {
  return board.every(cell => cell !== null);
};

// Get empty cells from the board
export const getEmptyCells = (board: Board): number[] => {
  return board.reduce((cells: number[], cell, index) => {
    if (cell === null) cells.push(index);
    return cells;
  }, []);
};

// Minimax algorithm for AI
export const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number = -Infinity,
  beta: number = Infinity
): { score: number; index?: number } => {
  const { winner } = checkWinner(board);
  
  // Terminal states
  if (winner === 'O') return { score: 10 - depth };
  if (winner === 'X') return { score: depth - 10 };
  if (checkDraw(board)) return { score: 0 };
  if (depth === 0) return { score: 0 };

  const emptyCells = getEmptyCells(board);
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove;
    
    for (const cellIndex of emptyCells) {
      // Make the move
      const newBoard = [...board];
      newBoard[cellIndex] = 'O';
      
      // Get score from this move
      const { score } = minimax(newBoard, depth - 1, false, alpha, beta);
      
      // Update best score
      if (score > bestScore) {
        bestScore = score;
        bestMove = cellIndex;
      }
      
      // Alpha-Beta pruning
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }
    
    return { score: bestScore, index: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove;
    
    for (const cellIndex of emptyCells) {
      // Make the move
      const newBoard = [...board];
      newBoard[cellIndex] = 'X';
      
      // Get score from this move
      const { score } = minimax(newBoard, depth - 1, true, alpha, beta);
      
      // Update best score
      if (score < bestScore) {
        bestScore = score;
        bestMove = cellIndex;
      }
      
      // Alpha-Beta pruning
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break;
    }
    
    return { score: bestScore, index: bestMove };
  }
};

// Get AI move based on difficulty
export const getAIMove = (board: Board, difficulty: string): number => {
  const emptyCells = getEmptyCells(board);
  
  // If board is empty or almost empty, randomize first few moves for variety
  if (emptyCells.length >= 8) {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
  
  // Set depth based on difficulty - increased depth for harder gameplay
  let depth;
  switch (difficulty) {
    case 'easy':
      depth = 2;
      // 20% chance to make a random move on easy mode
      if (Math.random() < 0.2) {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
      }
      break;
    case 'medium':
      depth = 6; // Increased from 4 to 6
      // 10% chance to make a suboptimal move on medium
      if (Math.random() < 0.1) {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
      }
      break;
    case 'hard':
    default:
      depth = 9; // Increased from 6 to 9 for maximum difficulty
      break;
  }
  
  // Use minimax to get the best move
  const { index } = minimax(board, depth, true);
  return index !== undefined ? index : emptyCells[0];
};

// Calculate win position coordinates for drawing the line
export const calculateWinLineCoordinates = (
  winLine: WinLine, 
  cellSize: number
): { x1: number; y1: number; x2: number; y2: number } => {
  if (!winLine) return { x1: 0, y1: 0, x2: 0, y2: 0 };
  
  const { start, end } = winLine;
  
  // Calculate row and column for start and end
  const startRow = Math.floor(start / 3);
  const startCol = start % 3;
  const endRow = Math.floor(end / 3);
  const endCol = end % 3;
  
  // Calculate center coordinates
  const halfCell = cellSize / 2;
  const x1 = startCol * cellSize + halfCell;
  const y1 = startRow * cellSize + halfCell;
  const x2 = endCol * cellSize + halfCell;
  const y2 = endRow * cellSize + halfCell;
  
  return { x1, y1, x2, y2 };
};

// Game storage operations
export const saveGameState = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

export const loadGameState = <T>(key: string, defaultValue: T): T => {
  try {
    const savedState = localStorage.getItem(key);
    return savedState ? JSON.parse(savedState) : defaultValue;
  } catch (error) {
    console.error('Error loading game state:', error);
    return defaultValue;
  }
};
