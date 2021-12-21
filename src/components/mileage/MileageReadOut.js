import styles from "./MileageReadOut.module.css";

export default function MileageReadOut(props) {
  const date = new Date(props.timeUtc);
  return (
    <div className={styles.mileageEntry}>
      <div>
        Mileage on {date.getDate()}-{date.getMonth()}-{date.getFullYear()} was:
      </div>
      <div className={styles.mileage}>{props.mileage.toLocaleString()} kms</div>
    </div>
  );
}
