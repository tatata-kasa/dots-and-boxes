export type Player = 1 | 2;

export interface LineKey {
  type: 'h' | 'v';
  row: number;
  col: number;
}

export interface GameConfig {
  rows: number;          // number of box-rows (dot-rows = rows + 1)
  cols: number;          // number of box-cols (dot-cols = cols + 1)
  drinkSquareCount: number;
}

export interface GameState {
  config: GameConfig;
  horizontalLines: (Player | null)[][];
  verticalLines: (Player | null)[][];
  boxes: (Player | null)[][];
  currentPlayer: Player;
  scores: Record<Player, number>;
  diceValue: number | null;
  linesLeft: number;
  phase: 'rolling' | 'drawing';
  isGameOver: boolean;
  drinkSquares: { row: number; col: number }[];
  revealedDrinkSquares: boolean[];
  drinkTriggerCount: number;
  drinkTriggerPlayer: Player | null;
}
