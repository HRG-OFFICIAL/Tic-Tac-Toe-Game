import type { GameState } from '@/types/game';
import { GameLogic } from './gameLogic';

export class AIPlayer {
  private difficulty: 'easy' | 'medium' | 'hard';

  constructor(difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    this.difficulty = difficulty;
  }

  getMove(state: GameState): number {
    switch (this.difficulty) {
      case 'easy':
        return this.getRandomMove(state);
      case 'medium':
        return Math.random() < 0.7 ? this.getBestMove(state) : this.getRandomMove(state);
      case 'hard':
        return this.getBestMove(state);
      default:
        return this.getRandomMove(state);
    }
  }

  private getRandomMove(state: GameState): number {
    const availableMoves = state.board
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null) as number[];
    
    if (availableMoves.length === 0) return 0;
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  private getBestMove(state: GameState): number {
    const availableMoves = state.board
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null) as number[];

    if (availableMoves.length === 0) return 0;

    // Check for winning move
    for (const move of availableMoves) {
      const testState = GameLogic.makeMove(state, move);
      if (testState.gameStatus === 'won' && testState.winner === state.currentPlayer) {
        return move;
      }
    }

    // Check for blocking move
    for (const move of availableMoves) {
      const testState = GameLogic.makeMove({
        ...state,
        currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X'
      }, move);
      if (testState.gameStatus === 'won') {
        return move;
      }
    }

    // Prefer center
    if (availableMoves.includes(4)) {
      return 4;
    }

    // Prefer corners
    const corners = [0, 2, 6, 8];
    for (const corner of corners) {
      if (availableMoves.includes(corner)) {
        return corner;
      }
    }

    // Prefer edges
    const edges = [1, 3, 5, 7];
    for (const edge of edges) {
      if (availableMoves.includes(edge)) {
        return edge;
      }
    }

    return availableMoves[0];
  }

  setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = difficulty;
  }
}

