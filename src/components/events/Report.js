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

import dayjs from "dayjs";

// this should display all the relevant info
// mileage and general events like: waxing and tire pumps
export default function Report() {
  // we should default to past 30 days
  // starting from today

  const [activeCar, setActiveCar] = useState(undefined);
  const [mileageEvents, setMileageEvents] = useState([]);
  const [fuelUpEvents, setFuelUpEvents] = useState([]);
  const initialTime = dayjs();

  const [startDatePicker, setStartDatePicker] = useState(initialTime);
  const [endDatePicker, setEndDatePicker] = useState(
    initialTime.subtract(30, "day")
  );

  useEffect(() => {
    getActiveCar((car) => {
      setActiveCar(car);

      getFuelUpEvents(
        car["id"],
        startDatePicker.valueOf(),
        endDatePicker.valueOf()
      ).then((events) => {
        setFuelUpEvents(events);
      });
      getMileageEvents(
        car["id"],
        startDatePicker.valueOf(),
        endDatePicker.valueOf()
      ).then((events) => {
        setMileageEvents(events);
      });
    });
  }, [startDatePicker, endDatePicker]);

  const changeStartTime = (event) => {
    // now we need to convert a string back into a dayjs object
    const newTime = dayjs(event.target.value, "YYYY-MM-DDTHH:mm:ss", "au");

    if (newTime > endDatePicker) {
      setStartDatePicker(newTime);
    }
  };

  const changeEndTime = (event) => {
    const newTime = dayjs(event.target.value, "YYYY-MM-DDTHH:mm:ss", "au");
    if (newTime < startDatePicker) {
      setEndDatePicker(newTime);
    }
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
            <EventWindow
              startTime={startDatePicker}
              endTime={endDatePicker}
              changeStartTime={changeStartTime}
              changeEndTime={changeEndTime}
            />
            {mileageEvents.length === 0 && fuelUpEvents.length === 0 ? (
              <>No events were found for this car</>
            ) : (
              <>
                <div>
                  {mileageEvents.length + fuelUpEvents.length} events were found
                  for your {activeCar.make}!
                </div>

                <MileageReport
                  events={mileageEvents}
                  startTime={startDatePicker}
                  endTime={endDatePicker}
                />
                <FuelReport
                  events={fuelUpEvents}
                  startTime={startDatePicker}
                  endTime={endDatePicker}
                />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function EventWindow({ startTime, changeStartTime, endTime, changeEndTime }) {
  // we are going from UTC to ISO
  const parsedStart = startTime
    .format()
    .substring(0, startTime.format().length - 6);
  const parsedEnd = endTime.format().substring(0, endTime.format().length - 6);

  console.debug({ parsedStart, parsedEnd });

  return (
    <div className={styles.eventWindowGrid}>
      <label>From:</label>
      <input
        type="datetime-local"
        value={parsedStart}
        onChange={changeStartTime}
      />
      <label>To:</label>
      <input
        type="datetime-local"
        value={parsedEnd}
        onChange={changeEndTime}
        max={parsedStart}
      />
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
