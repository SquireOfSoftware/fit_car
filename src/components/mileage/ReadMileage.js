import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./../../db/DB";

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
          {entry.carId} {entry.currentMileage}{" "}
          {new Date(entry.timeUtc).toISOString()}
        </div>
      ))}
    </div>
  );
}
