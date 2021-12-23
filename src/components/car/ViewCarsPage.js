import { useEffect, useState } from "react";

import Breadcrumb, { BreadcrumbIndicies } from "../breadcrumb/Breadcrumb";
import sharedStyles from "../SharedCard.module.css";
import sharedButton from "../SharedButton.module.css";
import styles from "./ViewCarsPage.module.css";
import { db } from "./../../db/DB";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faCog } from "@fortawesome/free-solid-svg-icons";
import CarCard from "./CarCard";

export default function ViewCarsPage() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    db.cars.orderBy("id").toArray((value) => {
      setCars(value);
    });
  }, []);

  // reads the lists of cars and shows your currently "active" one
  const addCar = () => {};

  return (
    <>
      <Breadcrumb
        uriSegments={[BreadcrumbIndicies.home, BreadcrumbIndicies.cars]}
      />
      <div className={styles.carList}>
        <h2>Currently active car</h2>

        {/* <button
          className={[sharedButton.button, styles.createCarButton].join(" ")}
          onClick={addCar}
        >
          Add a car
        </button> */}
        <Link
          className={[sharedButton.button, styles.createCarButton].join(" ")}
          to="add"
        >
          Add a car
        </Link>

        {cars.map((car, index) => {
          return <CarCard key={index} car={car} />;
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
