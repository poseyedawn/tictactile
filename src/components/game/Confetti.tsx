
import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}

const Confetti: React.FC<ConfettiProps> = ({ show }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  
  // Colors for confetti pieces
  const colors = [
    'hsl(var(--player-color))',
    'hsl(var(--ai-color))',
    'hsl(var(--win-line))',
    'hsl(var(--draw-color))',
    '#FFD700', // Gold
    '#FF4500', // Orange red
    '#7FFF00', // Chartreuse
    '#00FFFF', // Cyan
  ];
  
  // Create confetti pieces when show changes to true
  useEffect(() => {
    if (show) {
      const newPieces: ConfettiPiece[] = [];
      const pieceCount = 80;
      
      for (let i = 0; i < pieceCount; i++) {
        newPieces.push({
          id: i,
          x: 50 + (Math.random() - 0.5) * 20, // Center horizontally with slight variance
          y: 50, // Start in the middle
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          rotation: Math.random() * 360,
          delay: Math.random() * 0.5
        });
      }
      
      setPieces(newPieces);
      
      // Clear confetti after animation
      const timer = setTimeout(() => {
        setPieces([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  if (!show && pieces.length === 0) return null;
  
  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti animate-confetti"
          style={{
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            top: `${piece.y}%`,
            left: `${piece.x}%`,
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}s`,
            boxShadow: `0 0 ${piece.size / 2}px ${piece.color}`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
