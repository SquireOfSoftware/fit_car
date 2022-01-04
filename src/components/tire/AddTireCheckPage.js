import { useEffect, useState } from "react";
import Breadcrumb, { BreadcrumbIndicies } from "../breadcrumb/Breadcrumb";

import styles from "./AddTireCheckPage.module.css";
import sharedStyles from "../SharedCard.module.css";
import sharedButtons from "../SharedButton.module.css";
import NumberIncrementer from "../mileage/NumberIncrementer";

import {
  getActiveCar,
  getLastTireCheckEvent,
  addTireCheckEvent,
} from "../DBHelperFunctions";
import dayjs from "dayjs";

export default function AddTireCheckPage() {
  const [currentTirePressure, setCurrentTirePressure] = useState({
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0,
  });
  const [initialTirePressure, setInitialTirePressure] =
    useState(currentTirePressure);
  const [globalTirePressure, setGlobalTirePressure] = useState(30);
  const [initialGlobalTirePressure, setInitialGlobalTirePressure] =
    useState(globalTirePressure);
  const [activeCar, setActiveCar] = useState(undefined);

  useEffect(() => {
    getActiveCar((car) => {
      const currentTime = dayjs();
      setActiveCar(car);
      getLastTireCheckEvent(car["id"], currentTime.valueOf()).then((events) => {
        if (events.length !== 0) {
          const currentPressure = events[0]["pressure"];
          setGlobalTirePressure(currentPressure);
          setInitialGlobalTirePressure(currentPressure);
          const initialPressure = {
            topLeft: currentPressure,
            topRight: currentPressure,
            bottomLeft: currentPressure,
            bottomRight: currentPressure,
          };
          console.debug({ initialPressure, events });
          setInitialTirePressure(initialPressure);
          setCurrentTirePressure(initialPressure);
        }
      });
    });
  }, []);

  const setCurrentTire = (value, key) => {
    const newTirePressure = { ...currentTirePressure, [key]: value };
    console.log({
      currentTirePressure,
      newTirePressure,
    });
    setCurrentTirePressure(newTirePressure);
  };

  const handleSave = () => {
    // save to db
    // then set current tire pressure and initial tire pressure to global

    addTireCheckEvent({
      ...currentTirePressure,
      pressure: globalTirePressure,
      carId: activeCar["id"],
    }).then((ids) => {
      const newTirePressure = {
        topLeft: globalTirePressure,
        topRight: globalTirePressure,
        bottomLeft: globalTirePressure,
        bottomRight: globalTirePressure,
      };
      setCurrentTirePressure(newTirePressure);
      setInitialTirePressure(newTirePressure);
      setInitialGlobalTirePressure(globalTirePressure);
    });
  };

  const resetTirePressure = () => {
    setCurrentTirePressure(initialTirePressure);
    setGlobalTirePressure(initialGlobalTirePressure);
  };

  const hasChanged = () => {
    const hasChanged =
      currentTirePressure !== initialTirePressure ||
      globalTirePressure !== initialGlobalTirePressure;
    return hasChanged;
  };

  return (
    <>
      <Breadcrumb
        uriSegments={[
          BreadcrumbIndicies.home,
          BreadcrumbIndicies.tires,
          BreadcrumbIndicies.add,
        ]}
      />

      <h2>New tire pressure</h2>
      <div className={styles.newTirePressure}>
        <TirePressure
          customClass={styles.globalTireIncrementer}
          numericValue={globalTirePressure}
          callback={setGlobalTirePressure}
        />
      </div>

      <h2 className={styles.previousTireHeading}>Previous tire pressure</h2>
      <div className={styles.tireGrid}>
        <TirePressure
          label="Top Left Tire"
          customClass={styles.topLeftTireIncrementer}
          numericValue={currentTirePressure[TirePositions.topLeft]}
          callback={(value) => setCurrentTire(value, TirePositions.topLeft)}
        />
        <TirePressure
          label="Top Right Tire"
          customClass={styles.topRightTireIncrementer}
          numericValue={currentTirePressure[TirePositions.topRight]}
          callback={(value) => setCurrentTire(value, TirePositions.topRight)}
        />
        <TirePressure
          label="Bottom Left Tire"
          customClass={styles.bottomLeftTireIncrementer}
          numericValue={currentTirePressure[TirePositions.bottomLeft]}
          callback={(value) => setCurrentTire(value, TirePositions.bottomLeft)}
        />
        <TirePressure
          label="Bottom Right Tire"
          customClass={styles.bottomRightTireIncrementer}
          numericValue={currentTirePressure[TirePositions.bottomRight]}
          callback={(value) => setCurrentTire(value, TirePositions.bottomRight)}
        />
      </div>

      {hasChanged() ? (
        <>
          <button
            className={[
              sharedButtons.button,
              styles.saveTirePressureButton,
            ].join(" ")}
            onClick={handleSave}
          >
            Add tire check
          </button>
          <button
            className={[
              sharedButtons.button,
              styles.resetTirePressureButton,
            ].join(" ")}
            onClick={resetTirePressure}
          >
            Reset tire check
          </button>
        </>
      ) : (
        ""
      )}
    </>
  );
}

function TirePressure({ numericValue, callback, customClass, label }) {
  let stringifiedValue =
    numericValue !== undefined
      ? numericValue.toString().padStart(2, "0")
      : "00";

  const incrementNumber = (value, index) => {
    let newValue = value + Math.pow(10, index);
    if (newValue > 60) {
      newValue = 60;
    }
    console.log({ newValue });
    callback(newValue);
  };

  const decrementNumber = (value, index) => {
    let newValue = value - Math.pow(10, index);
    if (newValue < 0) {
      newValue = 0;
    }
    console.log({ newValue });
    callback(newValue);
  };

  return (
    <>
      <div className={[customClass, styles.tireIncrementer].join(" ")}>
        <p>{label}</p>
        <div>
          {stringifiedValue.split("").map((character, index) => {
            return (
              <NumberIncrementer
                key={index}
                currentDigit={character}
                isHidden={index < stringifiedValue.length - 3}
                incrementDigit={() => {
                  incrementNumber(
                    numericValue,
                    stringifiedValue.length - index - 1
                  );
                }}
                decrementDigit={() => {
                  decrementNumber(
                    numericValue,
                    stringifiedValue.length - index - 1
                  );
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

const TirePositions = {
  topLeft: "topLeft",
  topRight: "topRight",
  bottomLeft: "bottomLeft",
  bottomRight: "bottomRight",
};

export function AddTireCheckButton() {
  return (
    <div className={[sharedStyles.cardButton].join(" ")}>
      <div className={[sharedStyles.animatedCard].join(" ")}>
        <div className={[sharedStyles.animatedCardText].join(" ")}>
          Add Tire Check
        </div>
      </div>
    </div>
  );
}
