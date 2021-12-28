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

  useEffect(() => {
    getActiveCar((car) => {
      setActiveCar(car);
      const startTime = new Date();
      const endTime = new Date().setDate(startTime.getDate() - 30);

      getFuelUpEvents(car["id"], startTime.getTime(), endTime).then(
        (events) => {
          setFuelUpEvents(events);
        }
      );
      getMileageEvents(car["id"], startTime.getTime(), endTime).then(
        (events) => {
          setMileageEvents(events);
        }
      );
    });
  }, []);

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
