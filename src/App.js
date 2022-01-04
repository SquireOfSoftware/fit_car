import styles from "./App.module.css";
import { Outlet, Link } from "react-router-dom";
import { AddMileageButton } from "./components/mileage/AddMileageForm";
import { ReportButton } from "./components/events/Report";
import { FuelUpButton } from "./components/fuel/FuelUp";
import { AddOilCheckButton } from "./components/oil/AddOilCheckPage";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import { ViewCarsButton } from "./components/car/ViewCarsPage";
import { useState, useEffect } from "react";
import { db } from "./db/DB";
import { AddTireCheckButton } from "./components/tire/AddTireCheckPage";

function App() {
  const [activeCar, setActiveCar] = useState(undefined);

  useEffect(() => {
    // find the active car
    db.cars.where({ isActive: "true" }).toArray((cars) => {
      if (cars > 1) {
        console.error(
          `Well something went wrong here, we found ${cars.length} active cars, we only expected one`
        );
      } else if (cars.length === 0) {
        console.error(
          "We found no active cars, this means you need to create and configure a car for these stats to align to"
        );
      } else {
        console.debug({ cars });
        setActiveCar(cars[0]);
      }
    });
  }, []);

  console.debug({ activeCar });

  return (
    <div className={styles.app}>
      <Breadcrumb uriSegments={["home"]} />
      <div className={styles.appHeader}>
        <p>Fit Car</p>
      </div>
      {activeCar !== undefined && activeCar !== {} ? (
        <>
          <nav className={styles.appNav}>
            <Link to="/mileage/add">
              <AddMileageButton />
            </Link>
            <Link to="/fuel/add">
              <FuelUpButton />
            </Link>
            <Link to="/oil/add">
              <AddOilCheckButton />
            </Link>
            <Link to="/tires/add">
              <AddTireCheckButton />
            </Link>
            <Link to="/report">
              <ReportButton />
            </Link>
            <Link to="/cars">
              <ViewCarsButton />
            </Link>
          </nav>
          <Outlet />
        </>
      ) : (
        <>
          <div>
            We found no active cars, please activate a car before proceeding
          </div>
          <Link to="/cars/add">
            <ViewCarsButton />
          </Link>
        </>
      )}
    </div>
  );
}

export default App;
