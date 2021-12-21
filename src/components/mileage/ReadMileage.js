import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./../../db/DB";
import MileageReadOut from "./MileageReadOut";
import styles from "./ReadMileage.module.css";

export default function ReadMileage() {
  const storedData = useLiveQuery(() => {
    // get the most recent events
    return db.mileage.orderBy("timeUtc").reverse().limit(5).toArray();
  });

  if (!storedData) return null;

  return (
    <div className={styles.mileageSummary}>
      {storedData?.map((entry) => (
        <MileageReadOut
          key={entry.id}
          mileage={entry.currentMileage}
          timeUtc={entry.timeUtc}
        />
      ))}
    </div>
  );
}
