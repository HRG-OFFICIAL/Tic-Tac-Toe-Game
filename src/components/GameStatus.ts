import { useGameStore } from '@/store/gameStore';
import { GameLogic } from '@/utils/gameLogic';

export class GameStatus {
  private container: HTMLElement;
  private gameStore = useGameStore;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
  }

  render(): void {
    // The status display is now handled by the main status element
    // This component will just update the text content
  }

  update(): void {
    const state = this.gameStore.getState();
    
    // Update the main status display
    this.container.textContent = GameLogic.getGameStatusMessage(state);
    this.container.className = `game-status-display-main ${state.gameStatus}`;

    // Update scores
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');
    const scoreDraws = document.getElementById('score-draws');

    if (scoreX) scoreX.textContent = state.scores.X.toString();
    if (scoreO) scoreO.textContent = state.scores.O.toString();
    if (scoreDraws) scoreDraws.textContent = state.scores.draws.toString();
  }
}

