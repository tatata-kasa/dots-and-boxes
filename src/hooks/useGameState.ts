import { useState, useCallback } from 'react';
import type { GameState, Player, LineKey } from '../types/game';

const ROWS = 3;
const COLS = 6;

function createInitialState(): GameState {
  const drinkSquare = {
    row: Math.floor(Math.random() * ROWS),
    col: Math.floor(Math.random() * COLS),
  };

  return {
    horizontalLines: Array.from({ length: ROWS + 1 }, () => Array(COLS).fill(false)),
    verticalLines: Array.from({ length: ROWS }, () => Array(COLS + 1).fill(false)),
    boxes: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    currentPlayer: 1,
    scores: { 1: 0, 2: 0 },
    diceValue: null,
    linesLeft: 0,
    phase: 'rolling',
    isGameOver: false,
    drinkSquare,
    drinkSquareRevealed: false,
    drinkPlayer: null,
    bonusTurn: false,
    completedBoxThisTurn: false,
  };
}

function checkBoxes(
  state: GameState,
  lastLine: LineKey
): { newBoxes: (Player | null)[][]; completedCount: number; drinkTriggered: boolean } {
  const newBoxes = state.boxes.map(row => [...row]);
  const { horizontalLines, verticalLines, currentPlayer, drinkSquare } = state;
  let completedCount = 0;
  let drinkTriggered = false;

  const checkBox = (row: number, col: number) => {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
    if (newBoxes[row][col] !== null) return;

    const top = horizontalLines[row][col];
    const bottom = horizontalLines[row + 1][col];
    const left = verticalLines[row][col];
    const right = verticalLines[row][col + 1];

    if (top && bottom && left && right) {
      newBoxes[row][col] = currentPlayer;
      completedCount++;
      if (row === drinkSquare.row && col === drinkSquare.col) {
        drinkTriggered = true;
      }
    }
  };

  if (lastLine.type === 'h') {
    checkBox(lastLine.row - 1, lastLine.col);
    checkBox(lastLine.row, lastLine.col);
  } else {
    checkBox(lastLine.row, lastLine.col - 1);
    checkBox(lastLine.row, lastLine.col);
  }

  return { newBoxes, completedCount, drinkTriggered };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(createInitialState);

  const rollDice = useCallback((value: number) => {
    setState(prev => ({
      ...prev,
      diceValue: value,
      linesLeft: value,
      phase: 'drawing',
      bonusTurn: false,
      completedBoxThisTurn: false,
    }));
  }, []);

  const drawLine = useCallback((line: LineKey) => {
    setState(prev => {
      if (prev.phase !== 'drawing' || prev.linesLeft <= 0) return prev;

      const newH = prev.horizontalLines.map(row => [...row]);
      const newV = prev.verticalLines.map(row => [...row]);

      if (line.type === 'h') {
        if (newH[line.row][line.col]) return prev;
        newH[line.row][line.col] = true;
      } else {
        if (newV[line.row][line.col]) return prev;
        newV[line.row][line.col] = true;
      }

      const stateWithNewLine = { ...prev, horizontalLines: newH, verticalLines: newV };
      const { newBoxes, completedCount, drinkTriggered } = checkBoxes(stateWithNewLine, line);

      const newScores = { ...prev.scores };
      newScores[prev.currentPlayer] += completedCount;

      const totalBoxes = ROWS * COLS;
      const filledBoxes = newBoxes.flat().filter(b => b !== null).length;
      const isGameOver = filledBoxes === totalBoxes;

      let drinkPlayer = prev.drinkPlayer;
      let drinkSquareRevealed = prev.drinkSquareRevealed;
      if (drinkTriggered && !prev.drinkSquareRevealed) {
        drinkSquareRevealed = true;
        drinkPlayer = prev.currentPlayer;
      }

      const newLinesLeft = prev.linesLeft - 1;
      // Track if any box was completed during this turn (across multiple lines)
      const completedBoxThisTurn = prev.completedBoxThisTurn || completedCount > 0;

      if (isGameOver) {
        let winner: Player | 'both';
        if (newScores[1] > newScores[2]) winner = 2;
        else if (newScores[2] > newScores[1]) winner = 1;
        else winner = 'both';

        return {
          ...stateWithNewLine,
          boxes: newBoxes,
          scores: newScores,
          linesLeft: 0,
          phase: 'rolling',
          isGameOver: true,
          completedBoxThisTurn: false,
          drinkSquareRevealed,
          drinkPlayer: drinkTriggered ? prev.currentPlayer : winner === 'both' ? 'both' : winner,
        };
      }

      if (newLinesLeft <= 0) {
        if (completedBoxThisTurn) {
          return {
            ...stateWithNewLine,
            boxes: newBoxes,
            scores: newScores,
            linesLeft: 0,
            phase: 'rolling',
            diceValue: null,
            drinkSquareRevealed,
            drinkPlayer,
            bonusTurn: true,
            completedBoxThisTurn: false,
          };
        }
        return {
          ...stateWithNewLine,
          boxes: newBoxes,
          scores: newScores,
          linesLeft: 0,
          phase: 'rolling',
          diceValue: null,
          currentPlayer: prev.currentPlayer === 1 ? 2 : 1,
          drinkSquareRevealed,
          drinkPlayer,
          bonusTurn: false,
          completedBoxThisTurn: false,
        };
      }

      return {
        ...stateWithNewLine,
        boxes: newBoxes,
        scores: newScores,
        linesLeft: newLinesLeft,
        drinkSquareRevealed,
        drinkPlayer,
        completedBoxThisTurn,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(createInitialState());
  }, []);

  return { state, rollDice, drawLine, resetGame };
}
