import { db } from "./../../db/DB";
import NumberIncrementer from "./NumberIncrementer";
import styles from "./AddMileageForm.module.css";
import sharedStyles from "../SharedCard.module.css";
import sharedButtons from "../SharedButton.module.css";
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo, faPlus, faCarSide } from "@fortawesome/free-solid-svg-icons";

import ReadMileage from "./ReadMileage";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import EventTypes from "../events/EventTypes";

export function AddNewMileage() {
  const [mileageValue, setMileage] = useState(0);
  const [previousMileage, setPreviousMileage] = useState(0);
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
        console.log({ cars });
        setActiveCar(cars[0]);
        db.mileage
          .orderBy("timeUtc")
          .reverse()
          .filter((value) => value["carId"] === cars[0]["id"])
          .limit(1)
          .each((value) => {
            setMileage(value["currentMileage"]);
            setPreviousMileage(value["currentMileage"]);
          });
      }
    });
  }, []);

  // split the known value into digits, so convert value to string
  // then split the values up by digit
  let stringifiedValue = mileageValue.toString().padStart(6, "0");
  if (stringifiedValue.length < 8) {
    // we add the zero to the front to enable overflows
    stringifiedValue = "0" + stringifiedValue;
  }

  const incrementNumber = (baseValue, index) => {
    const newValue = baseValue + Math.pow(10, index);
    console.debug({ newValue });
    setMileage(newValue);
  };

  const decrementNumber = (baseValue, index) => {
    let newValue = baseValue - Math.pow(10, index);
    if (newValue < 0) {
      newValue = 0;
    }
    console.debug({ newValue });
    setMileage(newValue);
  };

  const addMileage = (currentMileage) => {
    const timeUtc = Date.now();

    db.mileage
      .add({
        carId: activeCar["id"],
        currentMileage,
        timeUtc,
      })
      .then((id) => {
        console.log(`db entry saved at ${id}`);
        setPreviousMileage(currentMileage);
        db.events.add({
          carId: activeCar["id"],
          type: EventTypes.mileage,
          timeUtc,
        });
      })
      .catch((error) =>
        console.log(`Failed to write to the browser db: ${error}`)
      );
  };

  const undoMileage = () => {
    setMileage(previousMileage);
  };

  return (
    <>
      <Breadcrumb uriSegments={["home", "mileage", "add"]} />
      {activeCar !== undefined && activeCar !== {} ? (
        <div className={styles.addMileageForm}>
          <h2>Add in today's mileage</h2>
          <div className={styles.mileageIncrementer}>
            {stringifiedValue.split("").map((character, index) => {
              return (
                <NumberIncrementer
                  key={index}
                  currentDigit={character}
                  isHidden={index < stringifiedValue.length - 3}
                  incrementDigit={() => {
                    incrementNumber(
                      mileageValue,
                      stringifiedValue.length - index - 1
                    );
                  }}
                  decrementDigit={() => {
                    decrementNumber(
                      mileageValue,
                      stringifiedValue.length - index - 1
                    );
                  }}
                />
              );
            })}
          </div>

          <button
            className={[sharedButtons.button, styles.saveButton].join(" ")}
            onClick={() => {
              addMileage(mileageValue);
            }}
          >
            <FontAwesomeIcon icon={faPlus} /> Add
          </button>
          <div
            className={[
              styles.mileageSummary,
              mileageValue !== 0 && mileageValue !== previousMileage
                ? ""
                : styles.invisible,
            ].join(" ")}
          >
            <div>{`You drove ${mileageValue - previousMileage} km${
              mileageValue - previousMileage !== 1 ? "s" : ""
            } today`}</div>
            <button
              className={[sharedButtons.button, styles.undoButton].join(" ")}
              onClick={undoMileage}
            >
              <FontAwesomeIcon icon={faUndo} /> Undo
            </button>
          </div>
          <ReadMileage limit={2} embedded={true} />
        </div>
      ) : (
        <div>
          No active car was found, please configure a car before proceeding
        </div>
      )}
    </>
  );
}

export function AddMileageButton() {
  return (
    <div className={[sharedStyles.cardButton].join(" ")}>
      <div
        className={[sharedStyles.animatedCard, styles.animatedCar].join(" ")}
      >
        <div className={styles.mountain}></div>
        <div className={[styles.mountain, styles.leftMountain].join(" ")}></div>
        <div className={styles.grass}></div>
        <FontAwesomeIcon className={styles.carIcon} icon={faCarSide} />
        <div className={[sharedStyles.animatedCardText].join(" ")}>
          Add Mileage
        </div>
      </div>
    </div>
  );
}
