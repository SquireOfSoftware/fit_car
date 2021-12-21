import { db } from "./../../db/DB";
import NumberIncrementer from "./NumberIncrementer";
import styles from "./AddMileageForm.module.css";
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo, faPlus, faCarSide } from "@fortawesome/free-solid-svg-icons";

export function AddNewMileage({ carId }) {
  const [mileageValue, setMileage] = useState(0);
  const [previousMileage, setPreviousMileage] = useState(0);

  useEffect(() => {
    db.mileage
      .orderBy("timeUtc")
      .reverse()
      .first()
      .then((value) => {
        setMileage(value["currentMileage"]);
        setPreviousMileage(value["currentMileage"]);
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
    let timeUtc = Date.now();

    db.mileage
      .add({
        carId,
        currentMileage,
        timeUtc,
      })
      .then((id) => {
        console.log(`db entry saved at ${id}`);
        setPreviousMileage(currentMileage);
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
        className={styles.saveButton}
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
        <button className={styles.undoButton} onClick={undoMileage}>
          <FontAwesomeIcon icon={faUndo} /> Undo
        </button>
      </div>
    </>
  );
}

export function AddMileageButton() {
  return (
    <div className={styles.addMileageButton}>
      <div className={styles.animatedCar}>
        <div className={styles.mountain}></div>
        <div className={[styles.mountain, styles.leftMountain].join(" ")}></div>
        <div className={styles.grass}></div>
        <FontAwesomeIcon className={styles.carIcon} icon={faCarSide} />
        <div className={styles.mileageButtonText}>Add Mileage</div>
      </div>
    </div>
  );
}
