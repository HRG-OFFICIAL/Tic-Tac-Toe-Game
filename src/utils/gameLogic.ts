import type { CellValue, Player, GameStatus, WinningCondition, GameState } from '@/types/game';

export class GameLogic {
  private static readonly WINNING_COMBINATIONS_3X3: number[][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  private static readonly WINNING_COMBINATIONS_4X4: number[][] = [
    // Rows
    [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
    // Columns
    [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
    // Diagonals
    [0, 5, 10, 15], [3, 6, 9, 12]
  ];

  private static readonly WINNING_COMBINATIONS_5X5: number[][] = [
    // Rows
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    // Columns
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    // Diagonals
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
  ];

  static createInitialState(boardSize: number = 3): GameState {
    const totalCells = boardSize * boardSize;
    return {
      board: Array(totalCells).fill(null),
      currentPlayer: 'X',
      gameStatus: 'playing',
      winner: null,
      moveCount: 0,
      scores: { X: 0, O: 0, draws: 0 },
      gameHistory: []
    };
  }

  private static getWinningCombinations(boardSize: number): number[][] {
    switch (boardSize) {
      case 3: return this.WINNING_COMBINATIONS_3X3;
      case 4: return this.WINNING_COMBINATIONS_4X4;
      case 5: return this.WINNING_COMBINATIONS_5X5;
      default: return this.WINNING_COMBINATIONS_3X3;
    }
  }

  static makeMove(state: GameState, position: number, boardSize: number = 3): GameState {
    if (!this.isValidMove(state, position, boardSize)) {
      return state;
    }

    const newBoard = [...state.board];
    newBoard[position] = state.currentPlayer;

    const newMoveCount = state.moveCount + 1;
    const newGameHistory = [
      ...state.gameHistory,
      {
        position,
        player: state.currentPlayer,
        timestamp: Date.now()
      }
    ];

    const winningCondition = this.checkWin(newBoard, boardSize);
    const totalCells = boardSize * boardSize;
    const isDraw = newMoveCount === totalCells && !winningCondition;

    let newGameStatus: GameStatus = 'playing';
    let newWinner: Player = null;

    if (winningCondition) {
      newGameStatus = 'won';
      newWinner = winningCondition.player;
    } else if (isDraw) {
      newGameStatus = 'draw';
    }

    const newScores = { ...state.scores };
    if (newGameStatus === 'won') {
      newScores[newWinner!]++;
    } else if (newGameStatus === 'draw') {
      newScores.draws++;
    }

    return {
      ...state,
      board: newBoard,
      currentPlayer: newGameStatus === 'playing' ? (state.currentPlayer === 'X' ? 'O' : 'X') : state.currentPlayer,
      gameStatus: newGameStatus,
      winner: newWinner,
      moveCount: newMoveCount,
      scores: newScores,
      gameHistory: newGameHistory
    };
  }

  static isValidMove(state: GameState, position: number, boardSize: number = 3): boolean {
    const totalCells = boardSize * boardSize;
    return (
      state.gameStatus === 'playing' &&
      position >= 0 &&
      position < totalCells &&
      state.board[position] === null
    );
  }

  static checkWin(board: CellValue[], boardSize: number = 3): WinningCondition | null {
    const combinations = this.getWinningCombinations(boardSize);
    for (const combination of combinations) {
      const firstValue = board[combination[0]];
      if (firstValue && combination.every(index => board[index] === firstValue)) {
        return {
          positions: combination,
          player: firstValue as Player
        };
      }
    }
    return null;
  }

  static resetGame(state: GameState, boardSize: number = 3): GameState {
    const totalCells = boardSize * boardSize;
    return {
      ...state,
      board: Array(totalCells).fill(null),
      currentPlayer: 'X',
      gameStatus: 'playing',
      winner: null,
      moveCount: 0,
      gameHistory: []
    };
  }

  static resetScores(state: GameState): GameState {
    return {
      ...state,
      scores: { X: 0, O: 0, draws: 0 }
    };
  }

  static getGameStatusMessage(state: GameState): string {
    switch (state.gameStatus) {
      case 'won':
        return `Player ${state.winner} wins.`;
      case 'draw':
        return "Game drawn.";
      case 'playing':
      default:
        return `Player ${state.currentPlayer}'s turn`;
    }
  }
}

