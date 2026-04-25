export type Player = 1 | 2;

export interface LineKey {
  type: 'h' | 'v';
  row: number;
  col: number;
}

export interface GameConfig {
  rows: number;
  cols: number;
  drinkSquareCount: number;
  playerNames: [string, string];
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
