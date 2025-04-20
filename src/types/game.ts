
// Game Types

export type Player = 'X' | 'O' | null;
export type Board = (Player)[];
export type GameStatus = 'playing' | 'won' | 'draw';
// Added 'fire' theme:
export type Theme = 'light' | 'dark' | 'neon' | 'retro' | 'watercolor' | 'fire';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'optimus';
export type WinLine = {
  start: number;
  end: number;
} | null;

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player;
  winLine: WinLine;
  moveCount: number;
  difficulty: Difficulty;
  aiThinking: boolean;
  theme: Theme;
  soundEnabled: boolean;
  availableThemes: Theme[];
  winStreak: number;
  bestStreak: number;
  fastestWin: number | null; // in seconds
}
