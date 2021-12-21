import { db } from "./../../db/DB";
import NumberIncrementer from "./NumberIncrementer";
import styles from "./AddMileageForm.module.css";
import { useState, useEffect } from "react";

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

  console.log(mileageValue);
  // split the known value into digits, so convert value to string
  // then split the values up by digit
  let stringifiedValue = "0" + mileageValue.toString().padStart(6, "0");

  const incrementNumber = (baseValue, index) => {
    const newValue = baseValue + Math.pow(10, index);
    console.log({ newValue });
    setMileage(newValue);
  };

  const decrementNumber = (baseValue, index) => {
    let newValue = baseValue - Math.pow(10, index);
    if (newValue < 0) {
      newValue = 0;
    }
    console.log({ newValue });
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
        <button
          className={styles.saveButton}
          onClick={() => {
            addMileage(mileageValue);
          }}
        >
          Add
        </button>
      </div>

      {mileageValue !== 0 && mileageValue !== previousMileage ? (
        <div>{`You drove ${mileageValue - previousMileage} km${
          mileageValue - previousMileage !== 1 ? "s" : ""
        } today`}</div>
      ) : (
        ""
      )}
    </>
  );
}
