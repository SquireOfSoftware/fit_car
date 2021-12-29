import sharedStyles from "../SharedCard.module.css";
import styles from "./Report.module.css";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { useEffect, useState } from "react";
import {
  getActiveCar,
  getFuelUpEvents,
  getMileageEvents,
} from "../DBHelperFunctions";
import FuelReport from "./FuelRreport";
import MileageReport from "./MileageReport";

// this should display all the relevant info
// mileage and general events like: waxing and tire pumps
export default function Report() {
  // we should default to past 30 days
  // starting from today

  const [activeCar, setActiveCar] = useState(undefined);
  const [mileageEvents, setMileageEvents] = useState([]);
  const [fuelUpEvents, setFuelUpEvents] = useState([]);
  const initialTime = new Date();

  const [startDatePicker, setStartDatePicker] = useState(initialTime);
  const [endDatePicker, setEndDatePicker] = useState(
    new Date(new Date().setDate(initialTime.getDate() - 30))
  );

  useEffect(() => {
    getActiveCar((car) => {
      setActiveCar(car);
      const startTime = new Date();
      const endTime = new Date(new Date().setDate(startTime.getDate() - 30));

      getFuelUpEvents(car["id"], startTime.getTime(), endTime.getTime()).then(
        (events) => {
          setFuelUpEvents(events);
        }
      );
      getMileageEvents(car["id"], startTime.getTime(), endTime.getTime()).then(
        (events) => {
          setMileageEvents(events);
        }
      );
    });
  }, []);

  console.log({ startDatePicker, endDatePicker });

  const changeStartTime = (event) => {
    console.log({ newTime: event.target.value });
    if (event.target.value > endDatePicker.getTime()) {
      setStartDatePicker(event.target.value);
    }
  };

  const changeEndTime = (event) => {
    setEndDatePicker(event.target.value);
  };

  return (
    <>
      <Breadcrumb uriSegments={["home", "reports"]} />

      <div className={styles.summaryReport}>
        {activeCar === undefined ? (
          <div>
            No configured car was detected, please ensure that you have a valid
            configured car
          </div>
        ) : (
          <div>
            {mileageEvents.length === 0 && fuelUpEvents.length === 0 ? (
              <>No events were found for this car</>
            ) : (
              <>
                <div>
                  {mileageEvents.length + fuelUpEvents.length} events were found
                  for your {activeCar.make}!
                </div>

                <EventWindow
                  startTime={startDatePicker}
                  endTime={endDatePicker}
                  changeStartTime={changeStartTime}
                  changeEndTime={changeEndTime}
                />

                <MileageReport events={mileageEvents} />
                <FuelReport events={fuelUpEvents} />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function EventWindow({ startTime, changeStartTime, endTime, changeEndTime }) {
  const toIsoString = (date) => {
    let pad = function (num) {
      var norm = Math.floor(Math.abs(num));
      return (norm < 10 ? "0" : "") + norm;
    };

    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds())
    );
  };

  const parsedStart = toIsoString(startTime);
  const parsedEnd = toIsoString(endTime);

  return (
    <div className={styles.eventWindowGrid}>
      <label>From:</label>
      <input
        type="datetime-local"
        value={parsedStart}
        onChange={changeStartTime}
      />
      <label>To:</label>
      <input type="datetime-local" value={parsedEnd} onChange={changeEndTime} />
    </div>
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
