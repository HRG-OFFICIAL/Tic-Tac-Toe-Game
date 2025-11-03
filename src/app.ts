import { useGameStore } from '@/store/gameStore';
import { GameBoard } from '@/components/GameBoard';
import { GameControls } from '@/components/GameControls';
import { GameStatus } from '@/components/GameStatus';
import { SettingsModal } from '@/components/SettingsModal';
import { GameHistory } from '@/components/GameHistory';
import { GameLogic } from '@/utils/gameLogic';
import { SoundManager } from '@/utils/soundManager';
import { AnimationManager } from '@/utils/animationManager';

export class TicTacToeApp {
  private gameStore = useGameStore;
  private gameBoard!: GameBoard;
  private gameControls!: GameControls;
  private gameStatus!: GameStatus;
  private gameHistory!: GameHistory;
  private soundManager = SoundManager.getInstance();
  private animationManager = AnimationManager.getInstance();

  constructor() {
    this.initializeComponents();
    this.setupEventListeners();
    this.initializeManagers();
    this.updateUI();
  }

  private initializeComponents(): void {
    // Initialize components
    const boardContainer = document.getElementById('game-board')!;
    const controlsContainer = document.getElementById('game-controls')!;
    const statusContainer = document.getElementById('game-status')!;
    const settingsContainer = document.getElementById('settings-modal-container')!;
    const historyContainer = document.getElementById('game-history')!;

    this.gameBoard = new GameBoard(boardContainer, {
      onCellClick: (index) => this.handleCellClick(index)
    });

    this.gameControls = new GameControls(controlsContainer);
    this.gameStatus = new GameStatus(statusContainer);
    new SettingsModal(settingsContainer);
    this.gameHistory = new GameHistory(historyContainer);

    // Subscribe to store changes
    this.gameStore.subscribe(
      (state) => state,
      () => this.updateUI()
    );

    // Subscribe to settings changes to re-render board
    this.gameStore.subscribe(
      (state) => state.settings,
      () => this.handleSettingsChange()
    );
  }

  private setupEventListeners(): void {
    // Listen for keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.gameStore.getState().resetGame();
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.gameStore.getState().undoMove();
      }
    });

    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  private handleCellClick(index: number): void {
    const state = this.gameStore.getState();
    
    // Don't allow moves if game is over or it's AI's turn
    if (state.gameStatus !== 'playing') return;
    
    if (state.settings.mode === 'human-vs-ai' && state.currentPlayer === 'O') return;
    if (state.settings.mode === 'ai-vs-ai') return;

    // Play sound for move with player-specific pitch
    this.soundManager.playSound('move', state.currentPlayer as 'X' | 'O' | undefined);

    this.gameStore.getState().makeMove(index);
  }

  private updateUI(): void {
    const state = this.gameStore.getState();
    
    // Update game board
    this.gameBoard.updateBoard(state.board);
    
    // Update winning condition
    const winningCondition = GameLogic.checkWin(state.board);
    this.gameBoard.setWinningCondition(winningCondition);

    // Disable board if game is over
    if (state.gameStatus !== 'playing') {
      this.gameBoard.disable();
    } else {
      this.gameBoard.enable();
    }

    // Update status and controls
    this.gameStatus.update();
    this.gameControls.updateUndoButton();
    this.gameHistory.update();

    // Add visual feedback for game end
    if (state.gameStatus === 'won' || state.gameStatus === 'draw') {
      // Play sound for game end
      if (state.gameStatus === 'won') {
        this.soundManager.playSound('win');
      } else {
        this.soundManager.playSound('draw');
      }
      
      this.showGameEndAnimation(state.gameStatus);
    }
  }

  private showGameEndAnimation(_status: 'won' | 'draw'): void {
    const board = document.getElementById('game-board');
    if (board) {
      board.classList.add('game-ended');
      setTimeout(() => {
        board.classList.remove('game-ended');
      }, 2000);
    }
  }

  private handleSettingsChange(): void {
    const state = this.gameStore.getState();
    
    // Apply theme changes
    this.applyTheme(state.settings.theme);
    
    // Re-render the game board when settings change
    const boardContainer = document.getElementById('game-board')!;
    this.gameBoard = new GameBoard(boardContainer, {
      onCellClick: (index) => this.handleCellClick(index)
    });
    this.updateUI();
  }

  private initializeManagers(): void {
    const state = this.gameStore.getState();
    this.soundManager.setSoundEnabled(state.settings.soundEnabled);
    this.animationManager.setAnimationsEnabled(state.settings.animationsEnabled);
    this.applyTheme(state.settings.theme);
    console.log('Managers initialized:', {
      soundEnabled: state.settings.soundEnabled,
      animationsEnabled: state.settings.animationsEnabled,
      theme: state.settings.theme
    });
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    this.updateThemeIcon(theme);
    console.log(`Theme applied: ${theme}`);
  }

  private toggleTheme(): void {
    const state = this.gameStore.getState();
    const newTheme = state.settings.theme === 'light' ? 'dark' : 'light';
    
    this.gameStore.getState().updateSettings({ theme: newTheme });
    this.applyTheme(newTheme);
  }

  private updateThemeIcon(theme: 'light' | 'dark'): void {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'light' ? 'Dark' : 'Light';
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TicTacToeApp();
});
