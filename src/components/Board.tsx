import type { GameState, LineKey, Player } from '../types/game';
import styles from '../styles/Board.module.css';

interface Props {
  state: GameState;
  onDrawLine: (line: LineKey) => void;
}

const ROWS = 3;
const COLS = 6;
const CELL = 52;
const DOT_R = 5;
const PAD = 20;

const SVG_W = PAD * 2 + COLS * CELL;
const SVG_H = PAD * 2 + ROWS * CELL;

const HIT_W = CELL - DOT_R * 2;
const HIT_H = 28;
const HIT_V_W = 28;
const HIT_V_H = CELL - DOT_R * 2;

export default function Board({ state, onDrawLine }: Props) {
  const { horizontalLines, verticalLines, boxes, currentPlayer, phase, drinkSquare, drinkSquareRevealed } = state;
  const canDraw = phase === 'drawing' && state.linesLeft > 0;

  const px = (col: number) => PAD + col * CELL;
  const py = (row: number) => PAD + row * CELL;

  const boxClass = (owner: Player) => owner === 1 ? styles.boxFill1 : styles.boxFill2;

  return (
    <div className={styles.boardWrapper}>
      <svg
        className={styles.svg}
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      >
        {/* Box fills */}
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => {
            const owner = boxes[r][c];
            const isDrink = drinkSquare.row === r && drinkSquare.col === c;
            const x = px(c);
            const y = py(r);
            return (
              <g key={`box-${r}-${c}`}>
                {owner && (
                  <rect
                    x={x} y={y}
                    width={CELL} height={CELL}
                    className={boxClass(owner)}
                  />
                )}
                {isDrink && drinkSquareRevealed && (
                  <rect
                    x={x} y={y}
                    width={CELL} height={CELL}
                    className={styles.boxDrink}
                  />
                )}
                {isDrink && drinkSquareRevealed && (
                  <text
                    x={x + CELL / 2}
                    y={y + CELL / 2 + 1}
                    className={styles.drinkIcon}
                  >
                    🍺
                  </text>
                )}
              </g>
            );
          })
        )}

        {/* Horizontal lines */}
        {Array.from({ length: ROWS + 1 }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => {
            const drawn = horizontalLines[r][c];
            const x1 = px(c);
            const y1 = py(r);
            const x2 = px(c + 1);
            const y2 = py(r);

            if (drawn) {
              const owner = r > 0 && boxes[r - 1][c] !== null ? boxes[r - 1][c]
                : r < ROWS && boxes[r][c] !== null ? boxes[r][c]
                : currentPlayer;
              return (
                <line
                  key={`h-${r}-${c}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  className={owner === 1 ? styles.lineDrawn1 : styles.lineDrawn2}
                />
              );
            }

            if (!canDraw) {
              return (
                <line
                  key={`h-${r}-${c}`}
                  x1={x1 + DOT_R} y1={y1}
                  x2={x2 - DOT_R} y2={y2}
                  className={styles.linePreview}
                  opacity={0.15}
                />
              );
            }

            return (
              <g
                key={`h-${r}-${c}`}
                className={styles.lineHitAreaGroup}
                onClick={() => onDrawLine({ type: 'h', row: r, col: c })}
              >
                <line
                  x1={x1 + DOT_R} y1={y1}
                  x2={x2 - DOT_R} y2={y2}
                  className={styles.linePreview}
                  opacity={0}
                />
                <rect
                  x={x1 + DOT_R} y={y1 - HIT_H / 2}
                  width={HIT_W} height={HIT_H}
                  className={styles.lineHitArea}
                />
              </g>
            );
          })
        )}

        {/* Vertical lines */}
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS + 1 }, (_, c) => {
            const drawn = verticalLines[r][c];
            const x1 = px(c);
            const y1 = py(r);
            const x2 = px(c);
            const y2 = py(r + 1);

            if (drawn) {
              const owner = c > 0 && boxes[r][c - 1] !== null ? boxes[r][c - 1]
                : c < COLS && boxes[r][c] !== null ? boxes[r][c]
                : currentPlayer;
              return (
                <line
                  key={`v-${r}-${c}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  className={owner === 1 ? styles.lineDrawn1 : styles.lineDrawn2}
                />
              );
            }

            if (!canDraw) {
              return (
                <line
                  key={`v-${r}-${c}`}
                  x1={x1} y1={y1 + DOT_R}
                  x2={x2} y2={y2 - DOT_R}
                  className={styles.linePreview}
                  opacity={0.15}
                />
              );
            }

            return (
              <g
                key={`v-${r}-${c}`}
                className={styles.lineHitAreaGroup}
                onClick={() => onDrawLine({ type: 'v', row: r, col: c })}
              >
                <line
                  x1={x1} y1={y1 + DOT_R}
                  x2={x2} y2={y2 - DOT_R}
                  className={styles.linePreview}
                  opacity={0}
                />
                <rect
                  x={x1 - HIT_V_W / 2} y={y1 + DOT_R}
                  width={HIT_V_W} height={HIT_V_H}
                  className={styles.lineHitArea}
                />
              </g>
            );
          })
        )}

        {/* Dots */}
        {Array.from({ length: ROWS + 1 }, (_, r) =>
          Array.from({ length: COLS + 1 }, (_, c) => (
            <circle
              key={`dot-${r}-${c}`}
              cx={px(c)} cy={py(r)}
              r={DOT_R}
              className={styles.dot}
            />
          ))
        )}
      </svg>
    </div>
  );
}
