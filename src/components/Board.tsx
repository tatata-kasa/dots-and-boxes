import type { GameState, LineKey, Player } from '../types/game';
import styles from '../styles/Board.module.css';

interface Props {
  state: GameState;
  onDrawLine: (line: LineKey) => void;
}

const CELL = 56;
const DOT_R = 5;
const PAD = 16;
const HIT_HALF = CELL / 2 - DOT_R;

export default function Board({ state, onDrawLine }: Props) {
  const { horizontalLines, verticalLines, boxes, phase, linesLeft, drinkSquares, revealedDrinkSquares } = state;
  const ROWS = boxes.length;
  const COLS = boxes[0].length;
  const SVG_W = PAD * 2 + COLS * CELL;
  const SVG_H = PAD * 2 + ROWS * CELL;
  const canDraw = phase === 'drawing' && linesLeft > 0;

  const px = (col: number) => PAD + col * CELL;
  const py = (row: number) => PAD + row * CELL;

  const lineClass = (owner: Player) => owner === 1 ? styles.lineDrawn1 : styles.lineDrawn2;
  const boxClass  = (owner: Player) => owner === 1 ? styles.boxFill1  : styles.boxFill2;

  return (
    <div className={styles.boardWrapper}>
      <svg className={styles.svg} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>

        {/* Box fills */}
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => {
            const owner = boxes[r][c];
            const drinkIdx = drinkSquares.findIndex(ds => ds.row === r && ds.col === c);
            const isRevealedDrink = drinkIdx >= 0 && revealedDrinkSquares[drinkIdx];
            const x = px(c), y = py(r);
            return (
              <g key={`box-${r}-${c}`}>
                {owner && <rect x={x+1} y={y+1} width={CELL-2} height={CELL-2} className={boxClass(owner)} />}
                {isRevealedDrink && <rect x={x+1} y={y+1} width={CELL-2} height={CELL-2} className={styles.boxDrink} />}
                {isRevealedDrink && <text x={x+CELL/2} y={y+CELL/2+1} className={styles.drinkIcon}>🍺</text>}
              </g>
            );
          })
        )}

        {/* Horizontal lines */}
        {Array.from({ length: ROWS + 1 }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => {
            const owner = horizontalLines[r][c];
            const x1 = px(c), y1 = py(r), x2 = px(c + 1);

            if (owner !== null) {
              return <line key={`h-${r}-${c}`} x1={x1} y1={y1} x2={x2} y2={y1} className={lineClass(owner)} />;
            }
            if (!canDraw) {
              return <line key={`h-${r}-${c}`} x1={x1} y1={y1} x2={x2} y2={y1} className={styles.lineGhost} />;
            }
            return (
              <g key={`h-${r}-${c}`} onClick={() => onDrawLine({ type: 'h', row: r, col: c })}>
                <line x1={x1} y1={y1} x2={x2} y2={y1}
                  className={styles.lineGhost} />
                <rect x={x1} y={y1 - HIT_HALF} width={CELL} height={HIT_HALF * 2}
                  fill="transparent" stroke="none" style={{ cursor: 'pointer' }} />
              </g>
            );
          })
        )}

        {/* Vertical lines */}
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS + 1 }, (_, c) => {
            const owner = verticalLines[r][c];
            const x1 = px(c), y1 = py(r), y2 = py(r + 1);

            if (owner !== null) {
              return <line key={`v-${r}-${c}`} x1={x1} y1={y1} x2={x1} y2={y2} className={lineClass(owner)} />;
            }
            if (!canDraw) {
              return <line key={`v-${r}-${c}`} x1={x1} y1={y1} x2={x1} y2={y2} className={styles.lineGhost} />;
            }
            return (
              <g key={`v-${r}-${c}`} onClick={() => onDrawLine({ type: 'v', row: r, col: c })}>
                <line x1={x1} y1={y1} x2={x1} y2={y2}
                  className={styles.lineGhost} />
                <rect x={x1 - HIT_HALF} y={y1} width={HIT_HALF * 2} height={CELL}
                  fill="transparent" stroke="none" style={{ cursor: 'pointer' }} />
              </g>
            );
          })
        )}

        {/* Dots on top */}
        {Array.from({ length: ROWS + 1 }, (_, r) =>
          Array.from({ length: COLS + 1 }, (_, c) => (
            <circle key={`dot-${r}-${c}`} cx={px(c)} cy={py(r)} r={DOT_R} className={styles.dot} />
          ))
        )}
      </svg>
    </div>
  );
}
