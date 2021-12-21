import sharedStyles from "../SharedCard.module.css";
import styles from "./Report.module.css";

// this should display all the relevant info
// mileage and general events like: waxing and tire pumps
export default function Report() {
  return <>This has all the events aggregated together</>;
}

export function ReportButton() {
  return (
    <div className={[sharedStyles.cardButton].join(" ")}>
      <div
        className={[sharedStyles.animatedCard, styles.animatedReport].join(" ")}
      >
        <div className={[sharedStyles.animatedCardText].join(" ")}>Report</div>
      </div>
    </div>
  );
}
