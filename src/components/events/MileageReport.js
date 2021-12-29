import styles from "./MileageReport.module.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {
  Label,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function MileageReport({ events, startTime, endTime, car }) {
  // this is so we can use the duration plugin
  dayjs.extend(duration);

  // we can assume that the events array is ordered in a descending order according to time
  // i.e. most recent is at the front

  const distanceTravelled =
    events[0].mileage - events[events.length - 1].mileage;

  // you can assume that in most cases the start time is larger than end time
  const timeDifference = dayjs.duration(startTime.diff(endTime));

  // let labels = [...Array(timeDifference.asDays()).keys()].map((number) => {
  //   return startTime.subtract(number, "days").format("DD/MM/YYYY");
  // });

  let mileageData = [];
  for (let i = 0; i < events.length; i++) {
    // we want to fill backwards
    // we need map the mileage records to days
    const eventTime = dayjs(events[i].timeUtc);
    // figure out the diff between the date and then auto fill
    const data = {
      date: eventTime.format("YYYY-MM-DD"),
      mileage: events[i].mileage,
      amt: events[i].mileage,
    };
    data[car["make"]] = events[i].mileage;

    mileageData.unshift(data);
  }

  console.log({ distanceTravelled, timeDifference, mileageData });

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
      {events.length > 0 ? (
        <div className={styles.mileageChart}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart width={500} height={300} data={mileageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                dataKey="mileage"
                angle={-45}
                textAnchor="end"
                domain={["dataMin - 100", "dataMax + 100"]}
              >
                <Label
                  value="mileage (kms)"
                  angle={-90}
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip />
              <Legend />
              <Line dataKey={car["make"]} stroke="#82ca9d" textAnchor="end" />
            </LineChart>
          </ResponsiveContainer>
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
