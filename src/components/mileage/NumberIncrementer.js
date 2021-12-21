import styles from "./NumberIncrementer.module.css";

// could go with an incrementing animation effect later: https://stackoverflow.com/questions/27956723/css-animation-number-increment-effect
export default function NumberIncrementer({
  currentDigit,
  isHidden,
  incrementDigit,
  decrementDigit,
}) {
  return (
    <div className={styles.digitIncrementer}>
      <button
        className={[styles.plus, isHidden ? styles.invisible : ""].join(" ")}
        onClick={incrementDigit}
      >
        +
      </button>
      <div className={styles.digit}>{currentDigit}</div>
      <button
        className={[styles.minus, isHidden ? styles.invisible : ""].join(" ")}
        onClick={decrementDigit}
      >
        -
      </button>
    </div>
  );
}
