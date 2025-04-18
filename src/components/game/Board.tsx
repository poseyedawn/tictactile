
import React, { useRef, useEffect, useState } from 'react';
import Cell from './Cell';
import { Board as BoardType, WinLine, Player } from '@/types/game';
import { calculateWinLineCoordinates } from '@/utils/gameUtils';
import { cn } from '@/lib/utils';

interface BoardProps {
  board: BoardType;
  winLine: WinLine;
  onCellClick: (index: number) => void;
  disabled: boolean;
  currentPlayer: Player;
}

const Board: React.FC<BoardProps> = ({
  board,
  winLine,
  onCellClick,
  disabled,
  currentPlayer
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, cellSize: 0 });
  const [coords, setCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  
  // Recalculate dimensions when board size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (boardRef.current) {
        const { width, height } = boardRef.current.getBoundingClientRect();
        const cellSize = width / 3; // 3x3 grid
        setDimensions({ width, height, cellSize });
        
        if (winLine) {
          setCoords(calculateWinLineCoordinates(winLine, cellSize));
        }
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [winLine]);

  // Update win line coordinates when winLine changes
  useEffect(() => {
    if (winLine && dimensions.cellSize > 0) {
      setCoords(calculateWinLineCoordinates(winLine, dimensions.cellSize));
    }
  }, [winLine, dimensions.cellSize]);
  
  return (
    <div 
      className="board-container w-full theme-transition mx-auto relative" 
      ref={boardRef}
    >
      <div className="board-grid">
        {board.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            onClick={() => onCellClick(index)}
            index={index}
            disabled={cell !== null || disabled}
            isWinningCell={!!winLine && 
              (index === winLine.start || 
               index === winLine.end || 
               index === Math.floor((winLine.start + winLine.end) / 2))
            }
          />
        ))}
      </div>
      
      {winLine && (
        <svg 
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        >
          <line
            x1={coords.x1}
            y1={coords.y1}
            x2={coords.x2}
            y2={coords.y2}
            stroke={`hsl(var(--win-line))`}
            strokeWidth="6"
            strokeLinecap="round"
            className="win-line animate-draw-line"
          />
        </svg>
      )}
    </div>
  );
};

export default Board;
