import styles from "./MileageReport.module.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

export default function MileageReport({ events, startTime, endTime }) {
  // this is so we can use the duration plugin
  dayjs.extend(duration);

  // we can assume that the events array is ordered in a descending order according to time
  // i.e. most recent is at the front

  const distanceTravelled =
    events[0].mileage - events[events.length - 1].mileage;

  // you can assume that in most cases the start time is larger than end time
  const timeDifference = dayjs.duration(startTime.diff(endTime));

  console.debug({ distanceTravelled, timeDifference });

  return (
    <>
      <h2>Mileage</h2>
      <details className={styles.detailBox}>
        <summary>{events.length} mileage events were found!</summary>
        <div>
          {events.map((event, index) => (
            <MileageEvent key={index} event={event} />
          ))}
        </div>
      </details>
      {distanceTravelled > 0 ? (
        <div>
          You travelled {distanceTravelled} kms in{" "}
          {timeDifference.asDays().toFixed(0)} days
        </div>
      ) : (
        ""
      )}
    </>
  );
}

function MileageEvent({ event }) {
  const date = new Date(event.timeUtc);
  return (
    <div>
      <div>
        {date.toLocaleString()} recorded {event.mileage} kms
      </div>
    </div>
  );
}
