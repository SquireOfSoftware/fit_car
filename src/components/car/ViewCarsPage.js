import { useEffect, useState } from "react";

import Breadcrumb, { BreadcrumbIndicies } from "../breadcrumb/Breadcrumb";
import sharedStyles from "../SharedCard.module.css";
import sharedButton from "../SharedButton.module.css";
import styles from "./ViewCarsPage.module.css";
import { db } from "./../../db/DB";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faCog, faPlus } from "@fortawesome/free-solid-svg-icons";
import CarCard from "./CarCard";

export default function ViewCarsPage() {
  const [cars, setCars] = useState([]);
  const [activeCar, setActiveCar] = useState({});

  useEffect(() => {
    db.cars.orderBy("id").toArray((value) => {
      setCars(value);
      value
        .filter((car) => car["isActive"] === "true")
        .map((car) => setActiveCar(car));
    });
  }, []);

  // reads the lists of cars and shows your currently "active" one
  // we need to deactivate the previous car and activate the new car
  const activateCar = (newCar) => {
    if (newCar["id"] === activeCar["id"]) {
      console.warn(
        `The car of ${newCar["id"]} is already active, ignoring the update`
      );
    } else {
      db.cars
        .update(newCar["id"], { isActive: "true" })
        .then((updatedEntries) => {
          setActiveCar(newCar);

          // we then need to find the car in the cars list and updated it
          const newCars = cars.map((car) => {
            if (car["id"] === newCar["id"]) {
              return { ...newCar, isActive: "true" };
            } else if (activeCar !== {} && car["id"] === activeCar["id"]) {
              // we deactivate the old car, if it exists
              return { ...activeCar, isActive: "false" };
            }
            return car;
          });
          console.debug({ newCars });

          setCars(newCars);

          if (activeCar !== {}) {
            db.cars.update(activeCar["id"], { isActive: "false" });
          }
        });
    }
  };

  return (
    <>
      <Breadcrumb
        uriSegments={[BreadcrumbIndicies.home, BreadcrumbIndicies.cars]}
      />
      <div className={styles.carList}>
        <Link
          className={[sharedButton.button, styles.createCarButton].join(" ")}
          to="add"
        >
          <FontAwesomeIcon icon={faPlus} />
          <div>Add a new car</div>
        </Link>
        <h2>Available cars</h2>
        {cars.map((car, index) => {
          return <CarCard key={index} car={car} activateCar={activateCar} />;
        })}
      </div>
    </>
  );
}

export function ViewCarsButton() {
  return (
    <div className={[sharedStyles.cardButton].join(" ")}>
      <div
        className={[sharedStyles.animatedCard, styles.viewCarsCard].join(" ")}
      >
        <div className={styles.garage}>
          <FontAwesomeIcon className={styles.car} icon={faCar} />
          <FontAwesomeIcon className={styles.cog} icon={faCog} />
          <FontAwesomeIcon className={styles.topCog} icon={faCog} />
        </div>
        <div
          className={[sharedStyles.animatedCardText, styles.viewCarsText].join(
            " "
          )}
        >
          Configured Cars
        </div>
      </div>
    </div>
  );
}
