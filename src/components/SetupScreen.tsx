import { useState } from 'react';
import type { GameConfig } from '../types/game';
import styles from '../styles/SetupScreen.module.css';

interface Props {
  onStart: (config: GameConfig) => void;
}

const GRID_OPTIONS = [
  { label: '4×5', dotRows: 4, dotCols: 5, rows: 3, cols: 4 },
  { label: '5×5', dotRows: 5, dotCols: 5, rows: 4, cols: 4 },
] as const;

function GridPreview({ dotRows, dotCols }: { dotRows: number; dotCols: number }) {
  const DOT_R = 3.5;
  const GAP = 14;
  const PAD = 6;
  const W = PAD * 2 + (dotCols - 1) * GAP;
  const H = PAD * 2 + (dotRows - 1) * GAP;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      {Array.from({ length: dotRows }, (_, r) =>
        Array.from({ length: dotCols }, (_, c) => (
          <circle
            key={`${r}-${c}`}
            cx={PAD + c * GAP}
            cy={PAD + r * GAP}
            r={DOT_R}
            fill="#f5deb3"
            opacity={0.85}
          />
        ))
      )}
    </svg>
  );
}

export default function SetupScreen({ onStart }: Props) {
  const [gridIdx, setGridIdx] = useState(0);
  const [drinkCount, setDrinkCount] = useState(1);

  const handleStart = () => {
    const g = GRID_OPTIONS[gridIdx];
    onStart({ rows: g.rows, cols: g.cols, drinkSquareCount: drinkCount });
  };

  return (
    <div className={styles.screen}>
      <div className={styles.logoArea}>
        <span className={styles.logoEmoji}>🍺</span>
        <h1 className={styles.title}>DOTS &amp; BOXES 飲みゲー</h1>
        <p className={styles.subtitle}>線を引いてマスを取れ！負けたら飲め！</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>マスのサイズ</div>
        <div className={styles.gridCards}>
          {GRID_OPTIONS.map((g, i) => (
            <div
              key={g.label}
              className={`${styles.gridCard} ${gridIdx === i ? styles.selected : ''}`}
              onClick={() => setGridIdx(i)}
            >
              <div className={styles.gridPreview}>
                <GridPreview dotRows={g.dotRows} dotCols={g.dotCols} />
              </div>
              <div className={styles.gridCardLabel}>{g.label}</div>
              <div className={styles.gridCardSub}>{g.rows}×{g.cols}マス ({g.rows * g.cols}マス)</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionLabel}>飲みマスの数</div>
        <div className={styles.drinkButtons}>
          {[1, 2, 3].map(n => (
            <button
              key={n}
              className={`${styles.drinkBtn} ${drinkCount === n ? styles.selected : ''}`}
              onClick={() => setDrinkCount(n)}
            >
              <span className={styles.drinkBtnNum}>{n}</span>
              <span className={styles.drinkBtnLabel}>{'🍺'.repeat(n)}</span>
            </button>
          ))}
        </div>
      </div>

      <button className={styles.startBtn} onClick={handleStart}>
        ゲームスタート！
      </button>
    </div>
  );
}
