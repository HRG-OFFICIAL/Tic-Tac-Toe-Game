import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { GameState, GameSettings } from '@/types/game';
import { GameLogic } from '@/utils/gameLogic';
import { AIPlayer } from '@/utils/aiPlayer';

interface GameStore extends GameState {
  settings: GameSettings;
  aiPlayer: AIPlayer;
  
  // Actions
  makeMove: (position: number) => void;
  resetGame: () => void;
  resetScores: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  undoMove: () => void;
}

const defaultSettings: GameSettings = {
  mode: 'human-vs-human',
  aiDifficulty: 'medium',
  boardSize: 3,
  soundEnabled: true,
  animationsEnabled: true,
  theme: 'light'
};

// Load settings from localStorage
const loadSettings = (): GameSettings => {
  try {
    const saved = localStorage.getItem('tic-tac-toe-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return defaultSettings;
};

// Save settings to localStorage
const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem('tic-tac-toe-settings', JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
};

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    ...GameLogic.createInitialState(),
    settings: loadSettings(),
    aiPlayer: new AIPlayer(loadSettings().aiDifficulty),

    makeMove: (position: number) => {
      const state = get();
      const boardSize = state.settings.boardSize;
      
      if (!GameLogic.isValidMove(state, position, boardSize)) {
        return;
      }

      const newState = GameLogic.makeMove(state, position, boardSize);
      set(newState);

      // Handle AI move if needed
      if (newState.gameStatus === 'playing' && 
          state.settings.mode !== 'human-vs-human' && 
          newState.currentPlayer !== null) {
        
        const shouldAIMove = 
          (state.settings.mode === 'human-vs-ai' && newState.currentPlayer === 'O');
        
        if (shouldAIMove) {
          setTimeout(() => {
            const aiMove = state.aiPlayer.getMove(newState);
            const finalState = GameLogic.makeMove(newState, aiMove, boardSize);
            set(finalState);
          }, 500); // Small delay for better UX
        }
      }
    },

    resetGame: () => {
      const state = get();
      const boardSize = state.settings.boardSize;
      set(GameLogic.resetGame(state, boardSize));
    },

    resetScores: () => {
      set(GameLogic.resetScores(get()));
    },

    updateSettings: (newSettings: Partial<GameSettings>) => {
      const state = get();
      const updatedSettings = { ...state.settings, ...newSettings };
      
      // Save to localStorage
      saveSettings(updatedSettings);
      
      set({
        settings: updatedSettings,
        aiPlayer: new AIPlayer(updatedSettings.aiDifficulty)
      });
    },

    undoMove: () => {
      const state = get();
      if (state.gameHistory.length === 0) return;

      const newHistory = [...state.gameHistory];
      newHistory.pop();

      const newBoard = Array(9).fill(null);
      let newMoveCount = 0;
      let newCurrentPlayer: 'X' | 'O' = 'X';

      for (const move of newHistory) {
        newBoard[move.position] = move.player;
        newMoveCount++;
        newCurrentPlayer = move.player === 'X' ? 'O' : 'X';
      }

      set({
        board: newBoard,
        currentPlayer: newCurrentPlayer,
        gameStatus: 'playing',
        winner: null,
        moveCount: newMoveCount,
        gameHistory: newHistory
      });
    }
  }))
);

