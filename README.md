# Tic-Tac-Toe (TypeScript + Vite)

A modular Tic-Tac-Toe implementation built with TypeScript and Vite. It supports human vs human and human vs AI modes, variable board sizes (3x3, 4x4, 5x5), move history, undo, themes, animations, and basic sound effects. State management uses Zustand, and build tooling uses Vite.

## Screenshots

![Main Screen](screenshots/screen.jpeg)
![Light Theme](screenshots/light-theme.png)
![Dark Theme](screenshots/dark-theme.png)

## Features

### Core Gameplay

- Multiple game modes: human vs human, human vs AI
- AI opponent with three difficulty levels: easy, medium, hard
- Variable board sizes: 3x3 (classic), 4x4, 5x5
- Undo functionality: revert the most recent move
- Game history with timestamps and scrollable list
- Score tracking across games
- Winning highlights: visually distinct winning-line indication

### UI/UX

- Dual theme support: light and dark
- Responsive layout across desktop, tablet, and mobile
- Typography: Inter font via Google Fonts
- Smooth animations for moves and state changes
- Accessibility: keyboard shortcuts and basic screen reader support
- Custom scrollbars for consistent appearance

### Audio & Visual

- Sound effects for moves, wins, and button interactions
- Animation system: cell animations and winning line highlights
- Visual feedback for hover, active states, and status indicators
- Theme toggle with persistent preference

### Technical Overview

- TypeScript for type safety
- Modular architecture with components and utilities
- State management via Zustand
- Build tooling with Vite
- ESLint configuration for code quality
- Local storage for persistent settings

## Technologies

- TypeScript
- Vite
- Zustand
- CSS

## Installation

Prerequisites: Node.js 18+ and npm.

- Clone: `git clone <repo-url> && cd Tic-Tac-Toe-Game`
- Install: `npm install`
- Develop: `npm run dev` (opens on port 3000 per `vite.config.ts`)
- Build: `npm run build` (output in `dist/`)
- Preview: `npm run preview`

## Project Structure

```
src/
├── components/         # UI components (board, controls, status, history, settings)
├── store/              # Zustand store and actions
├── types/              # TypeScript types
├── utils/              # Game logic, AI, sound, animation
├── styles/             # Styles
└── app.ts              # App bootstrap
```

## Usage

- Start the dev server and open the app.
- Use the settings modal to select mode, difficulty, board size, theme, and toggles.
- Use controls for new game, undo, and reset scores.

## How to Play

1. Choose game mode in the settings modal.
2. Select board size (3x3, 4x4, or 5x5).
3. Click an empty cell to place a mark (X or O).
4. Win by forming a line: 3 in a row (3x3), 4 in a row (4x4), 5 in a row (5x5).
5. Track scores and move history in the side panel.
6. Use Undo to revert the last move.

## Game Controls

- New Game: start a new round
- Undo: revert the previous move
- Reset Scores: clear cumulative scores
- Settings: open configuration modal
- Theme Toggle: switch between light and dark themes

## Keyboard Shortcuts

- `Ctrl/Cmd + R`: start a new game
- `Ctrl/Cmd + Z`: undo last move
- `Escape`: close the settings modal

## Game Modes

### Human vs Human
- Two players alternate turns on the same device.

### Human vs AI
- Play against an AI opponent with configurable difficulty:
  - Easy: random move selection with minimal strategy
  - Medium: mix of heuristic and random selection
  - Hard: best-move heuristic with optimal play on 3x3 boards

## License

MIT License. See `LICENSE`.

## Notes

- The AI logic is optimized for 3x3 and uses simple heuristics for larger boards.
- Undo respects the current board size.
