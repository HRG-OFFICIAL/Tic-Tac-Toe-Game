import { useGameStore } from '@/store/gameStore';

export class GameHistory {
  private container: HTMLElement;
  private gameStore = useGameStore;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  render(): void {
    this.container.innerHTML = `
      <div id="history-list" class="history-list">
        <div class="history-empty">No moves yet</div>
      </div>
      <div class="history-actions">
        <button id="clear-history" class="btn btn-outline btn-sm">Clear History</button>
      </div>
    `;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const clearBtn = this.container.querySelector('#clear-history');
    clearBtn?.addEventListener('click', () => {
      this.gameStore.getState().resetGame();
    });
  }

  update(): void {
    const history = this.gameStore.getState().gameHistory;
    const historyList = this.container.querySelector('#history-list');
    
    if (!historyList) return;

    if (history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No moves yet</div>';
      return;
    }

    const historyItems = history.map((move, index) => `
      <div class="history-item">
        <span class="move-number">${index + 1}.</span>
        <span class="player-symbol player-${move.player?.toLowerCase()}">${move.player}</span>
        <span class="move-position">Position ${move.position}</span>
        <span class="move-time">${this.formatTime(move.timestamp)}</span>
      </div>
    `).join('');

    historyList.innerHTML = historyItems;
  }

  private formatTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
  }
}
