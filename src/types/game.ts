export type Player = 'X' | 'O' | null;

export type CellValue = Player;

export type GameStatus = 'playing' | 'won' | 'draw';

export interface GameState {
  board: CellValue[];
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player;
  moveCount: number;
  scores: {
    X: number;
    O: number;
    draws: number;
  };
  gameHistory: GameMove[];
}

export interface GameMove {
  position: number;
  player: Player;
  timestamp: number;
}

export interface WinningCondition {
  positions: number[];
  player: Player;
}

export type GameMode = 'human-vs-human' | 'human-vs-ai' | 'ai-vs-ai';

export interface GameSettings {
  mode: GameMode;
  aiDifficulty: 'easy' | 'medium' | 'hard';
  boardSize: 3 | 4 | 5;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  theme: 'light' | 'dark';
}

