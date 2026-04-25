import { useState } from 'react';
import type { GameConfig } from '../types/game';
import styles from '../styles/SetupScreen.module.css';

interface Props {
  onStart: (config: GameConfig) => void;
}

const GRID_OPTIONS = [
  { label: '4×5', dotRows: 4, dotCols: 5, rows: 3, cols: 4 },
  { label: '5×5', dotRows: 5, dotCols: 5, rows: 4, cols: 4 },
  { label: '4×7', dotRows: 4, dotCols: 7, rows: 3, cols: 6 },
] as const;

function GridPreview({ dotRows, dotCols }: { dotRows: number; dotCols: number }) {
  const DOT_R = 2.5;
  const GAP = 10;
  const PAD = 5;
  const W = PAD * 2 + (dotCols - 1) * GAP;
  const H = PAD * 2 + (dotRows - 1) * GAP;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      {Array.from({ length: dotRows }, (_, r) =>
        Array.from({ length: dotCols }, (_, c) => (
          <circle key={`${r}-${c}`} cx={PAD + c * GAP} cy={PAD + r * GAP} r={DOT_R} fill="#f5deb3" opacity={0.8} />
        ))
      )}
    </svg>
  );
}

export default function SetupScreen({ onStart }: Props) {
  const [gridIdx, setGridIdx]       = useState(0);
  const [drinkCount, setDrinkCount] = useState(1);
  const [p1Name, setP1Name]         = useState('');
  const [p2Name, setP2Name]         = useState('');

  const handleStart = () => {
    const g = GRID_OPTIONS[gridIdx];
    onStart({
      rows: g.rows,
      cols: g.cols,
      drinkSquareCount: drinkCount,
      playerNames: [p1Name.trim(), p2Name.trim()],
    });
  };

  return (
    <div className={styles.screen}>
      <div className={styles.logoArea}>
        <span className={styles.logoEmoji}>🍺</span>
        <h1 className={styles.title}>DOTS &amp; BOXES with Dice</h1>
        <p className={styles.subtitle}>線を引いてマスを取れ！負けたら飲め！</p>
      </div>

      {/* Player names */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>プレイヤー名</div>
        <div className={styles.playerNameRow}>
          <div className={styles.nameInputWrapper}>
            <span className={`${styles.nameLabel} ${styles.p1}`}>PLAYER 1</span>
            <input
              className={styles.nameInput}
              type="text"
              maxLength={10}
              placeholder=""
              value={p1Name}
              onChange={e => setP1Name(e.target.value)}
            />
          </div>
          <div className={styles.nameInputWrapper}>
            <span className={`${styles.nameLabel} ${styles.p2}`}>PLAYER 2</span>
            <input
              className={styles.nameInput}
              type="text"
              maxLength={10}
              placeholder=""
              value={p2Name}
              onChange={e => setP2Name(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Grid size */}
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
              <div className={styles.gridCardSub}>{g.rows * g.cols}マス</div>
            </div>
          ))}
        </div>
      </div>

      {/* Drink squares */}
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
