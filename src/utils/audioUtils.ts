
// Audio utilities for the game
// Note: In a real implementation, we would have actual sound files
// For this version, we're using the Web Audio API to generate simple sounds

interface AudioCache {
  [key: string]: AudioBuffer;
}

// Create a shared AudioContext
const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

let audioContext: AudioContext | null = null;
const audioCache: AudioCache = {};

export const initializeAudio = (): void => {
  try {
    audioContext = getAudioContext();
  } catch (error) {
    console.error('Web Audio API not supported:', error);
  }
};

// Play generated sound effects
const playSound = (
  type: 'tap' | 'win' | 'draw' | 'unlock', 
  enabled: boolean = true
): void => {
  if (!audioContext || !enabled) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure sound based on type
    switch (type) {
      case 'tap':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          500, 
          audioContext.currentTime + 0.1
        );
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01, 
          audioContext.currentTime + 0.1
        );
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
        
      case 'win':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(580, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          700, 
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.exponentialRampToValueAtTime(
          900, 
          audioContext.currentTime + 0.2
        );
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01, 
          audioContext.currentTime + 0.3
        );
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
        
      case 'draw':
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          150, 
          audioContext.currentTime + 0.3
        );
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01, 
          audioContext.currentTime + 0.3
        );
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
        
      case 'unlock':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          900, 
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.exponentialRampToValueAtTime(
          700, 
          audioContext.currentTime + 0.2
        );
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01, 
          audioContext.currentTime + 0.3
        );
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
    }
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

// Sound effect API for game
export const sounds = {
  playTap: (enabled: boolean = true) => playSound('tap', enabled),
  playWin: (enabled: boolean = true) => playSound('win', enabled),
  playDraw: (enabled: boolean = true) => playSound('draw', enabled),
  playUnlock: (enabled: boolean = true) => playSound('unlock', enabled)
};
