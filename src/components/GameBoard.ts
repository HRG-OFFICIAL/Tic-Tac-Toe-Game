import type { CellValue, WinningCondition } from '@/types/game';
import { useGameStore } from '@/store/gameStore';
import { AnimationManager } from '@/utils/animationManager';

interface GameBoardProps {
  onCellClick: (index: number) => void;
  winningCondition?: WinningCondition | null;
}

export class GameBoard {
  private container: HTMLElement;
  private cells: HTMLElement[] = [];
  private onCellClick: (index: number) => void;
  private winningCondition?: WinningCondition | null;
  private boardSize: number = 3;
  private animationManager = AnimationManager.getInstance();

  constructor(container: HTMLElement, props: GameBoardProps) {
    this.container = container;
    this.onCellClick = props.onCellClick;
    this.winningCondition = props.winningCondition;
    this.updateBoardSize();
    this.render();
  }

  updateBoardSize(): void {
    const state = useGameStore.getState();
    this.boardSize = state.settings.boardSize;
  }

  render(): void {
    this.updateBoardSize();
    this.container.innerHTML = '';
    this.cells = [];

    // Update grid layout based on board size
    this.container.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
    this.container.style.gridTemplateRows = `repeat(${this.boardSize}, 1fr)`;

    const totalCells = this.boardSize * this.boardSize;
    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'game-cell';
      cell.dataset.index = i.toString();
      cell.addEventListener('click', () => this.handleCellClick(i));
      
      this.container.appendChild(cell);
      this.cells.push(cell);
    }

    this.updateWinningHighlight();
  }

  updateBoard(board: CellValue[]): void {
    board.forEach((value, index) => {
      const cell = this.cells[index];
      if (cell) {
        const previousValue = cell.textContent;
        cell.textContent = value || '';
        cell.className = `game-cell ${value ? `player-${value.toLowerCase()}` : ''}`;
        
        // Animate cell if it was just filled
        if (value && !previousValue) {
          this.animationManager.animateCell(cell, 'move');
        }
      }
    });
    this.updateWinningHighlight();
  }

  setWinningCondition(condition: WinningCondition | null): void {
    this.winningCondition = condition;
    this.updateWinningHighlight();
  }

  private updateWinningHighlight(): void {
    this.cells.forEach((cell, index) => {
      const wasWinning = cell.classList.contains('winning-cell');
      cell.classList.remove('winning-cell');
      
      if (this.winningCondition?.positions.includes(index)) {
        cell.classList.add('winning-cell');
        // Animate winning cell if it just became winning
        if (!wasWinning) {
          this.animationManager.animateCell(cell, 'win');
        }
      }
    });
  }

  private handleCellClick(index: number): void {
    this.onCellClick(index);
  }

  disable(): void {
    this.cells.forEach(cell => {
      cell.classList.add('disabled');
    });
  }

  enable(): void {
    this.cells.forEach(cell => {
      cell.classList.remove('disabled');
    });
  }
}

