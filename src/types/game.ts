export type Player = 1 | 2;

export interface LineKey {
  type: 'h' | 'v';
  row: number;
  col: number;
}

export interface GameState {
  horizontalLines: boolean[][];
  verticalLines: boolean[][];
  boxes: (Player | null)[][];
  currentPlayer: Player;
  scores: Record<Player, number>;
  diceValue: number | null;
  linesLeft: number;
  phase: 'rolling' | 'drawing';
  isGameOver: boolean;
  drinkSquare: { row: number; col: number };
  drinkSquareRevealed: boolean;
  drinkPlayer: Player | 'both' | null;
  bonusTurn: boolean;
  completedBoxThisTurn: boolean;
}

export function lineKeyToString(line: LineKey): string {
  return `${line.type}-${line.row}-${line.col}`;
}
