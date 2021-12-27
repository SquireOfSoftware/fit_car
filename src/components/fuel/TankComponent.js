import styles from "./TankComponent.module.css";

export default function TankComponent({
  description,
  customClass,
  clickCallback,
  currentTank,
}) {
  const currentStyle = {
    top: currentTank.pixelValue.toFixed(2) + "px",
  };

  const id = "fuelContainer-" + customClass;

  const handleClick = (event) => {
    const container = document.getElementById(id);
    const computedYCoord =
      event.clientY - container.offsetParent.offsetTop - container.offsetTop;
    const computedPercentage =
      (1 - computedYCoord / container.offsetHeight) * 100;

    console.debug({
      computedPercentage,
      computedYCoord,
      clientY: event.clientY,
      offsetTop: container.offsetTop,
    });

    clickCallback({
      percentage: computedPercentage,
      pixelValue: computedYCoord,
    });
  };

  return (
    <div className={[styles.container].join(" ")}>
      <div className={styles.description}>
        {description}: {currentTank.percentage.toFixed(2)}%
      </div>
      <div
        id={id}
        className={[styles.fuelTankContainer].join(" ")}
        onClick={handleClick}
      >
        <div className={styles.gasLevel} style={currentStyle}></div>

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
    </div>
  );
}
