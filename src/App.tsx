import { useState, useEffect } from 'react';
import type { GameConfig } from './types/game';
import { useGameState } from './hooks/useGameState';
import Board from './components/Board';
import Dice from './components/Dice';
import ResultModal from './components/ResultModal';
import SetupScreen from './components/SetupScreen';
import styles from './styles/App.module.css';

// ─── Game screen (rendered only when config is set) ───────────────────────────
function GameScreen({ config, onBack }: { config: GameConfig; onBack: () => void }) {
  const { state, rollDice, drawLine, resetGame } = useGameState(config);
  const [showDrinkBanner, setShowDrinkBanner] = useState(false);
  const [prevTriggerCount, setPrevTriggerCount] = useState(0);

  useEffect(() => {
    if (state.drinkTriggerCount > prevTriggerCount) {
      setShowDrinkBanner(true);
      const t = setTimeout(() => setShowDrinkBanner(false), 2400);
      setPrevTriggerCount(state.drinkTriggerCount);
      return () => clearTimeout(t);
    }
  }, [state.drinkTriggerCount, prevTriggerCount]);

  const p1Active = state.currentPlayer === 1;
  const p2Active = state.currentPlayer === 2;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>🍺 DOTS &amp; BOXES 飲みゲー</h1>
        <p className={styles.headerSub}>線を引いてマスを取れ！負けたら飲め！</p>
      </header>

      <div className={styles.playerBar}>
        <div className={`${styles.playerCard} ${styles.p1} ${p1Active ? styles.active : ''}`}>
          <div className={styles.playerName}>PLAYER 1</div>
          <div className={styles.playerScore}>{state.scores[1]}</div>
        </div>

        <div className={styles.turnIndicator}>
          {p1Active && <span className={styles.turnArrow}>◀</span>}
          <span>{state.phase === 'rolling' ? '振る番' : '線を引く'}</span>
          {p2Active && <span className={styles.turnArrow}>▶</span>}
        </div>

        <div className={`${styles.playerCard} ${styles.p2} ${p2Active ? styles.active : ''}`}>
          <div className={styles.playerName}>PLAYER 2</div>
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
            <div className={styles.drinkBannerSub}>Player {state.drinkTriggerPlayer} — 1杯飲め！</div>
          </div>
        </div>
      )}

      {state.isGameOver && (
        <ResultModal
          state={state}
          onReplay={() => resetGame()}
          onBack={onBack}
        />
      )}
    </div>
  );
}

// ─── Root: screen routing ─────────────────────────────────────────────────────
export default function App() {
  const [config, setConfig] = useState<GameConfig | null>(null);

  if (!config) {
    return <SetupScreen onStart={setConfig} />;
  }
  return <GameScreen config={config} onBack={() => setConfig(null)} />;
}
