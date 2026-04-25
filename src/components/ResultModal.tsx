import type { GameState } from '../types/game';
import styles from '../styles/ResultModal.module.css';

interface Props {
  state: GameState;
  onReplay: () => void;
}

export default function ResultModal({ state, onReplay }: Props) {
  const { scores, drinkPlayer, drinkSquareRevealed } = state;
  const isP1Winner = scores[1] > scores[2];
  const isP2Winner = scores[2] > scores[1];
  const isDraw = scores[1] === scores[2];

  let trophy = '🏆';
  let titleText = '';
  let subtitleText = '';

  if (isDraw) {
    trophy = '🤝';
    titleText = '引き分け！';
    subtitleText = '両者同点！乾杯しろ！';
  } else if (isP1Winner) {
    trophy = '🏆';
    titleText = 'PLAYER 1 の勝ち！';
    subtitleText = 'Player 2 は飲め！';
  } else {
    trophy = '🏆';
    titleText = 'PLAYER 2 の勝ち！';
    subtitleText = 'Player 1 は飲め！';
  }

  let drinkMsgLines: string[] = [];
  if (isDraw) {
    drinkMsgLines = ['🥂 乾杯！ 両者1杯ずつ！'];
  } else if (isP1Winner) {
    drinkMsgLines = ['🍺 Player 2 が飲む！'];
  } else {
    drinkMsgLines = ['🍺 Player 1 が飲む！'];
  }

  if (drinkSquareRevealed && drinkPlayer) {
    drinkMsgLines.push(`💀 飲みマス発動！ Player ${drinkPlayer} も追加で1杯！`);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.trophy}>{trophy}</div>
        <h2 className={styles.title}>{titleText}</h2>
        <p className={styles.subtitle}>{subtitleText}</p>

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

        <div className={styles.drinkMsg}>
          {drinkMsgLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

        <button className={styles.replayBtn} onClick={onReplay}>
          🔄 もう一度遊ぶ
        </button>
      </div>
    </div>
  );
}
