import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./../../db/DB";
import MileageReadOut from "./MileageReadOut";

export default function ReadMileage() {
  const storedData = useLiveQuery(() => {
    // get the most recent events
    return db.mileage.orderBy("timeUtc").reverse().limit(5).toArray();
  });

  console.log(storedData);

  if (!storedData) return null;

  return (
    <div>
      {storedData?.map((entry) => (
        <div key={entry.id}>
          <MileageReadOut
            id={entry.id}
            mileage={entry.currentMileage}
            timeUtc={entry.timeUtc}
          />
        </div>
      ))}
    </div>
  );
}
