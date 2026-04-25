import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import Board from './components/Board';
import Dice from './components/Dice';
import ResultModal from './components/ResultModal';
import styles from './styles/App.module.css';

export default function App() {
  const { state, rollDice, drawLine, resetGame } = useGameState();
  const [showDrinkBanner, setShowDrinkBanner] = useState(false);
  const [prevRevealed, setPrevRevealed] = useState(false);

  useEffect(() => {
    if (state.drinkSquareRevealed && !prevRevealed) {
      setShowDrinkBanner(true);
      const t = setTimeout(() => setShowDrinkBanner(false), 2400);
      setPrevRevealed(true);
      return () => clearTimeout(t);
    }
  }, [state.drinkSquareRevealed, prevRevealed]);

  const handleReplay = () => {
    setPrevRevealed(false);
    setShowDrinkBanner(false);
    resetGame();
  };

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
        <Dice
          onRollDone={rollDice}
          phase={state.phase}
          linesLeft={state.linesLeft}
        />
      </div>

      {showDrinkBanner && (
        <div className={styles.drinkBanner}>
          <div className={styles.drinkBannerInner}>
            <span className={styles.drinkEmoji}>🍺</span>
            <div className={styles.drinkBannerText}>飲みマス発動！</div>
            <div className={styles.drinkBannerSub}>Player {state.drinkPlayer} — 1杯飲め！</div>
          </div>
        </div>
      )}

      {state.isGameOver && (
        <ResultModal state={state} onReplay={handleReplay} />
      )}
    </div>
  );
}
