import type { GameState } from '../types/game';
import styles from '../styles/ResultModal.module.css';

interface Props {
  state: GameState;
  onReplay: () => void;
  onBack: () => void;
}

export default function ResultModal({ state, onReplay, onBack }: Props) {
  const { scores } = state;
  const isP1Winner = scores[1] > scores[2];
  const isP2Winner = scores[2] > scores[1];
  const isDraw = !isP1Winner && !isP2Winner;

  const trophy = isDraw ? '🤝' : '🏆';
  const titleText = isDraw ? '引き分け！' : isP1Winner ? 'PLAYER 1 の勝ち！' : 'PLAYER 2 の勝ち！';

  let drinkMsg: string;
  if (isDraw) {
    drinkMsg = '🥂 乾杯！ 両者1杯ずつ！';
  } else if (isP1Winner) {
    drinkMsg = '🍺 Player 2 が飲む！';
  } else {
    drinkMsg = '🍺 Player 1 が飲む！';
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.trophy}>{trophy}</div>
        <h2 className={styles.title}>{titleText}</h2>

        <div className={styles.scores}>
          <div className={`${styles.scoreCard} ${isP1Winner ? styles.winner : ''}`}>
            <div className={`${styles.playerLabel} ${styles.p1}`}>PLAYER 1</div>
            <div className={styles.scoreNum}>{scores[1]}</div>
          </div>
          <div className={`${styles.scoreCard} ${isP2Winner ? styles.winner : ''}`}>
            <div className={`${styles.playerLabel} ${styles.p2}`}>PLAYER 2</div>
            <div className={styles.scoreNum}>{scores[2]}</div>
          </div>
        </div>

        <div className={styles.drinkMsg}>{drinkMsg}</div>

        <button className={styles.replayBtn} onClick={onReplay}>
          🔄 もう一度遊ぶ
        </button>
        <button className={styles.backBtn} onClick={onBack}>
          ⚙️ 設定に戻る
        </button>
      </div>
    </div>
  );
}
