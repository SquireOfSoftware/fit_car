import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./../../db/DB";
import MileageReadOut from "./MileageReadOut";
import styles from "./ReadMileage.module.css";
import sharedStyles from "../SharedCard.module.css";
import Breadcrumb from "../breadcrumb/Breadcrumb";

export default function ReadMileage({ limit, embedded }) {
  const storedData = useLiveQuery(() => {
    let queryLimit = limit !== undefined ? limit : 5;
    // get the most recent events
    return db.mileage.orderBy("timeUtc").reverse().limit(queryLimit).toArray();
  });

  if (!storedData) return null;

  return (
    <>
      {!embedded ? <Breadcrumb uriSegments={["home", "mileage"]} /> : ""}
      <div className={styles.mileageSummary}>
        <h2>The last {limit !== undefined ? limit : 5} readings</h2>
        {storedData?.map((entry) => (
          <MileageReadOut
            key={entry.id}
            mileage={entry.mileage}
            timeUtc={entry.timeUtc}
          />
        ))}
      </div>
    </>
  );
}

export function ReadMileageButton() {
  return (
    <div className={[sharedStyles.cardButton].join(" ")}>
      <div
        className={[sharedStyles.animatedCard, styles.animatedMileage].join(
          " "
        )}
      >
        <div className={[sharedStyles.animatedCardText].join(" ")}>
          Mileage History
        </div>
      </div>
    </div>
  );
}
