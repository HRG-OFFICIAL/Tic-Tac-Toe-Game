import { useGameStore } from '@/store/gameStore';
import { SoundManager } from '@/utils/soundManager';

export class GameControls {
  private container: HTMLElement;
  private gameStore = useGameStore;
  private soundManager = SoundManager.getInstance();

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.setupEventListeners();
  }

  render(): void {
    this.container.innerHTML = `
      <button id="reset-game" class="btn btn-control">
        <span>🔄</span> New Game
      </button>
      <button id="undo-move" class="btn btn-control">
        <span>↩</span> Undo
      </button>
      <button id="reset-scores" class="btn btn-control">
        <span>📊</span> Reset Scores
      </button>
      <button id="settings-btn" class="btn btn-control">
        <span>⚙️</span> Settings
      </button>
    `;
  }

  private setupEventListeners(): void {
    const resetBtn = this.container.querySelector('#reset-game');
    const undoBtn = this.container.querySelector('#undo-move');
    const resetScoresBtn = this.container.querySelector('#reset-scores');
    const settingsBtn = this.container.querySelector('#settings-btn');

    resetBtn?.addEventListener('click', () => {
      this.soundManager.playSound('button');
      this.gameStore.getState().resetGame();
    });

    undoBtn?.addEventListener('click', () => {
      this.soundManager.playSound('button');
      this.gameStore.getState().undoMove();
    });

    resetScoresBtn?.addEventListener('click', () => {
      this.soundManager.playSound('button');
      this.gameStore.getState().resetScores();
    });

    settingsBtn?.addEventListener('click', () => {
      this.soundManager.playSound('button');
      this.toggleSettings();
    });
  }

  private toggleSettings(): void {
    const settingsModal = document.getElementById('settings-modal-container');
    if (settingsModal) {
      settingsModal.classList.toggle('active');
    }
  }

  updateUndoButton(): void {
    const undoBtn = this.container.querySelector('#undo-move') as HTMLButtonElement;
    const canUndo = this.gameStore.getState().gameHistory.length > 0;
    
    if (undoBtn) {
      undoBtn.disabled = !canUndo;
      undoBtn.classList.toggle('disabled', !canUndo);
    }
  }
}

