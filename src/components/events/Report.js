import sharedStyles from "../SharedCard.module.css";
import styles from "./Report.module.css";
import Breadcrumb from "../breadcrumb/Breadcrumb";

// this should display all the relevant info
// mileage and general events like: waxing and tire pumps
export default function Report() {
  return (
    <>
      <Breadcrumb uriSegments={["home", "reports"]} />

      <p>This has all the events aggregated together</p>
    </>
  );
}

export function ReportButton() {
  return (
    <div className={[sharedStyles.cardButton].join(" ")}>
      <div
        className={[sharedStyles.animatedCard, styles.animatedReport].join(" ")}
      >
        <div
          className={[styles.animatedColumn, styles.animatedColumnOne].join(
            " "
          )}
        ></div>
        <div
          className={[styles.animatedColumn, styles.animatedColumnTwo].join(
            " "
          )}
        ></div>
        <div
          className={[styles.animatedColumn, styles.animatedColumnThree].join(
            " "
          )}
        ></div>
        <div className={[sharedStyles.animatedCardText].join(" ")}>Reports</div>
      </div>
    </div>
  );
}
