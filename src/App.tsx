import { useState, useEffect, useRef } from 'react';
import type { GameConfig } from './types/game';
import { useGameState } from './hooks/useGameState';
import Board from './components/Board';
import Dice from './components/Dice';
import ResultModal from './components/ResultModal';
import SetupScreen from './components/SetupScreen';
import styles from './styles/App.module.css';

// ─── Game screen ──────────────────────────────────────────────────────────────
function GameScreen({ config, onReplay, onBack }: {
  config: GameConfig;
  onReplay: () => void;
  onBack: () => void;
}) {
  const { state, rollDice, drawLine } = useGameState(config);
  const [showDrinkBanner, setShowDrinkBanner] = useState(false);
  // useRef avoids the cleanup-cancels-timer bug that occurs with useState deps
  const prevTriggerCountRef = useRef(0);

  useEffect(() => {
    if (state.drinkTriggerCount > prevTriggerCountRef.current) {
      prevTriggerCountRef.current = state.drinkTriggerCount;
      setShowDrinkBanner(true);
      const t = setTimeout(() => setShowDrinkBanner(false), 2400);
      return () => clearTimeout(t);
    }
  }, [state.drinkTriggerCount]);

  const p1 = config.playerNames[0] || 'PLAYER 1';
  const p2 = config.playerNames[1] || 'PLAYER 2';
  const p1Active = state.currentPlayer === 1;
  const p2Active = state.currentPlayer === 2;
  const triggerName = state.drinkTriggerPlayer === 1 ? p1 : p2;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>🍺 DOTS &amp; BOXES with Dice</h1>
        <p className={styles.headerSub}>線を引いてマスを取れ！負けたら飲め！</p>
      </header>

      <div className={styles.playerBar}>
        <div className={`${styles.playerCard} ${styles.p1} ${p1Active ? styles.active : ''}`}>
          <div className={styles.playerName}>{p1}</div>
          <div className={styles.playerScore}>{state.scores[1]}</div>
        </div>

        <div className={styles.turnIndicator}>
          {p1Active && <span className={styles.turnArrow}>◀</span>}
          <span>{state.phase === 'rolling' ? '振る番' : '線を引く'}</span>
          {p2Active && <span className={styles.turnArrow}>▶</span>}
        </div>

        <div className={`${styles.playerCard} ${styles.p2} ${p2Active ? styles.active : ''}`}>
          <div className={styles.playerName}>{p2}</div>
          <div className={styles.playerScore}>{state.scores[2]}</div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.boardSection}>
        <Board state={state} onDrawLine={drawLine} />
      </div>

      <div className={styles.divider} />

      <div className={styles.diceSection}>
        <Dice onRollDone={rollDice} phase={state.phase} linesLeft={state.linesLeft} />
      </div>

      {showDrinkBanner && (
        <div className={styles.drinkBanner}>
          <div className={styles.drinkBannerInner}>
            <span className={styles.drinkEmoji}>🍺</span>
            <div className={styles.drinkBannerText}>飲みマス発動！</div>
            <div className={styles.drinkBannerSub}>{triggerName} — 1杯飲め！</div>
          </div>
        </div>
      )}

      {state.isGameOver && (
        <ResultModal state={state} onReplay={onReplay} onBack={onBack} />
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [config, setConfig] = useState<GameConfig | null>(null);
  // Increment key on each game start/replay to force full GameScreen remount
  const [gameKey, setGameKey] = useState(0);

  const handleStart = (cfg: GameConfig) => {
    setConfig(cfg);
    setGameKey(k => k + 1);
  };

  if (!config) {
    return <SetupScreen onStart={handleStart} />;
  }

  return (
    <GameScreen
      key={gameKey}
      config={config}
      onReplay={() => setGameKey(k => k + 1)}
      onBack={() => setConfig(null)}
    />
  );
}
