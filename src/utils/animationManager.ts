export class AnimationManager {
  private static instance: AnimationManager;
  private animationsEnabled: boolean = true;

  private constructor() {}

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  setAnimationsEnabled(enabled: boolean): void {
    this.animationsEnabled = enabled;
  }

  animateCell(cell: HTMLElement, animationType: 'move' | 'win' | 'pulse'): void {
    if (!this.animationsEnabled) return;

    // Remove any existing animation classes
    cell.classList.remove('cell-move', 'cell-win', 'cell-pulse');
    
    // Force reflow
    cell.offsetHeight;
    
    // Add animation class
    cell.classList.add(`cell-${animationType}`);
    
    // Remove animation class after animation completes
    setTimeout(() => {
      cell.classList.remove(`cell-${animationType}`);
    }, 600);
  }

  animateStatus(statusElement: HTMLElement, animationType: 'celebration' | 'pulse'): void {
    if (!this.animationsEnabled) return;

    statusElement.classList.remove('celebration', 'pulse');
    statusElement.offsetHeight;
    statusElement.classList.add(animationType);
    
    setTimeout(() => {
      statusElement.classList.remove(animationType);
    }, 1000);
  }

  animateBoard(board: HTMLElement, animationType: 'celebration'): void {
    if (!this.animationsEnabled) return;

    board.classList.remove('game-ended');
    board.offsetHeight;
    board.classList.add(animationType);
    
    setTimeout(() => {
      board.classList.remove(animationType);
    }, 1000);
  }
}
