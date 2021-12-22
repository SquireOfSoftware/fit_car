import styles from "./TankComponent.module.css";

export default function TankComponent({ handleClick, fuelGaugeStyle }) {
  return (
    <div
      id="fuelContainer"
      className={styles.fuelTankContainer}
      onClick={handleClick}
    >
      <div className={styles.gasLevel} style={fuelGaugeStyle}></div>

      <div className={[styles.ninetyMark, styles.minorMark].join(" ")}></div>
      <div className={[styles.eightyMark, styles.minorMark].join(" ")}></div>
      <div className={[styles.seventyMark, styles.minorMark].join(" ")}></div>
      <div className={[styles.sixtyMark, styles.minorMark].join(" ")}></div>
      <div className={[styles.fiftyMark, styles.majorMark].join(" ")}></div>
      <div className={[styles.fourtyMark, styles.minorMark].join(" ")}></div>
      <div className={[styles.thirtyMark, styles.minorMark].join(" ")}></div>
      <div className={[styles.twentyMark, styles.minorMark].join(" ")}></div>
      <div className={[styles.tenMark, styles.minorMark].join(" ")}></div>
      <div className={[styles.zeroMark, styles.minorMark].join(" ")}></div>
    </div>
  );
}
