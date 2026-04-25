import { useState, useCallback } from 'react';
import type { GameState, Player, LineKey, GameConfig } from '../types/game';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createInitialState(config: GameConfig): GameState {
  const { rows, cols, drinkSquareCount } = config;
  const allPositions = Array.from({ length: rows * cols }, (_, i) => ({
    row: Math.floor(i / cols),
    col: i % cols,
  }));
  const drinkSquares = shuffle(allPositions).slice(0, drinkSquareCount);

  return {
    config,
    horizontalLines: Array.from({ length: rows + 1 }, () => Array<Player | null>(cols).fill(null)),
    verticalLines: Array.from({ length: rows }, () => Array<Player | null>(cols + 1).fill(null)),
    boxes: Array.from({ length: rows }, () => Array<Player | null>(cols).fill(null)),
    currentPlayer: 1,
    scores: { 1: 0, 2: 0 },
    diceValue: null,
    linesLeft: 0,
    phase: 'rolling',
    isGameOver: false,
    drinkSquares,
    revealedDrinkSquares: Array(drinkSquareCount).fill(false),
    drinkTriggerCount: 0,
    drinkTriggerPlayer: null,
  };
}

function checkBoxes(
  state: GameState,
  lastLine: LineKey
): { newBoxes: (Player | null)[][]; completedCount: number; drinkTriggerIndices: number[] } {
  const rows = state.boxes.length;
  const cols = state.boxes[0].length;
  const newBoxes = state.boxes.map(row => [...row]);
  const { horizontalLines, verticalLines, currentPlayer, drinkSquares, revealedDrinkSquares } = state;
  let completedCount = 0;
  const drinkTriggerIndices: number[] = [];

  const checkBox = (row: number, col: number) => {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return;
    if (newBoxes[row][col] !== null) return;
    if (
      horizontalLines[row][col] &&
      horizontalLines[row + 1][col] &&
      verticalLines[row][col] &&
      verticalLines[row][col + 1]
    ) {
      newBoxes[row][col] = currentPlayer;
      completedCount++;
      const idx = drinkSquares.findIndex(ds => ds.row === row && ds.col === col);
      if (idx >= 0 && !revealedDrinkSquares[idx]) {
        drinkTriggerIndices.push(idx);
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

  return { newBoxes, completedCount, drinkTriggerIndices };
}

export function useGameState(config: GameConfig) {
  const [state, setState] = useState<GameState>(() => createInitialState(config));

  const rollDice = useCallback((value: number) => {
    setState(prev => ({ ...prev, diceValue: value, linesLeft: value, phase: 'drawing' }));
  }, []);

  const drawLine = useCallback((line: LineKey) => {
    setState(prev => {
      if (prev.phase !== 'drawing' || prev.linesLeft <= 0) return prev;

      const newH = prev.horizontalLines.map(row => [...row]);
      const newV = prev.verticalLines.map(row => [...row]);

      if (line.type === 'h') {
        if (newH[line.row][line.col] !== null) return prev;
        newH[line.row][line.col] = prev.currentPlayer;
      } else {
        if (newV[line.row][line.col] !== null) return prev;
        newV[line.row][line.col] = prev.currentPlayer;
      }

      const stateWithLine = { ...prev, horizontalLines: newH, verticalLines: newV };
      const { newBoxes, completedCount, drinkTriggerIndices } = checkBoxes(stateWithLine, line);

      const newScores = { ...prev.scores };
      newScores[prev.currentPlayer] += completedCount;

      const totalBoxes = newBoxes.length * newBoxes[0].length;
      const isGameOver = newBoxes.flat().filter(b => b !== null).length === totalBoxes;

      const newRevealedDrinkSquares = [...prev.revealedDrinkSquares];
      let newDrinkTriggerCount = prev.drinkTriggerCount;
      let newDrinkTriggerPlayer = prev.drinkTriggerPlayer;
      for (const idx of drinkTriggerIndices) {
        newRevealedDrinkSquares[idx] = true;
        newDrinkTriggerCount++;
        newDrinkTriggerPlayer = prev.currentPlayer;
      }

      const newLinesLeft = prev.linesLeft - 1;
      const hitDrinkSquare = drinkTriggerIndices.length > 0;

      const base = {
        ...stateWithLine,
        boxes: newBoxes,
        scores: newScores,
        revealedDrinkSquares: newRevealedDrinkSquares,
        drinkTriggerCount: newDrinkTriggerCount,
        drinkTriggerPlayer: newDrinkTriggerPlayer,
      };

      if (isGameOver) {
        return { ...base, linesLeft: 0, phase: 'rolling' as const, isGameOver: true };
      }

      // Force turn end when drink square is captured
      if (newLinesLeft <= 0 || hitDrinkSquare) {
        return {
          ...base,
          linesLeft: 0,
          phase: 'rolling' as const,
          diceValue: null,
          currentPlayer: (prev.currentPlayer === 1 ? 2 : 1) as Player,
        };
      }

      return { ...base, linesLeft: newLinesLeft };
    });
  }, []);

  return { state, rollDice, drawLine };
}
