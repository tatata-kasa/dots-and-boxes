import { useRef, useState } from 'react';
import ReactDice from 'react-dice-complete';
import type { ReactDiceRef } from 'react-dice-complete';
import styles from '../styles/Dice.module.css';

interface Props {
  onRollDone: (value: number) => void;
  phase: 'rolling' | 'drawing';
  linesLeft: number;
  bonusTurn: boolean;
}

export default function Dice({ onRollDone, phase, linesLeft, bonusTurn }: Props) {
  const diceRef = useRef<ReactDiceRef>(null);
  const [rolling, setRolling] = useState(false);

  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);
    diceRef.current?.rollAll();
  };

  const handleRollDone = (_total: number, values: number[]) => {
    setRolling(false);
    onRollDone(values[0]);
  };

  return (
    <div className={styles.diceArea}>
      {bonusTurn && phase === 'rolling' && (
        <div className={styles.bonusMsg}>🎉 ボーナスターン！もう一度振れる</div>
      )}
      <div className={styles.diceRow}>
        <ReactDice
          ref={diceRef}
          numDice={1}
          rollDone={handleRollDone}
          faceColor="#2a1a08"
          dotColor="#f5deb3"
          dieSize={64}
          rollTime={1.2}
          defaultRoll={6}
          outline
          outlineColor="#c8860a"
          disableIndividual
        />
      </div>
      {phase === 'rolling' ? (
        <button
          className={styles.rollBtn}
          onClick={handleRoll}
          disabled={rolling}
        >
          {rolling ? '🎲 振り中...' : '🎲 サイコロを振る'}
        </button>
      ) : (
        <div className={styles.linesLeft}>
          残り <span className={styles.linesLeftNum}>{linesLeft}</span> 本
        </div>
      )}
    </div>
  );
}
