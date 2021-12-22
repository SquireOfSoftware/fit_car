import styles from "./FuelTank.module.css";
import sharedButtons from "../SharedButton.module.css";
import { useState, useEffect } from "react";
import { db } from "./../../db/DB";
import EventTypes from "../events/EventTypes";
import NumberIncrementer from "../mileage/NumberIncrementer";

export default function FuelTank({ carId }) {
  // fuelTank is just the pixel display of it all
  const [fuelTank, setFuelTank] = useState(0);
  const [previousFuelTank, setPreviousFuelTank] = useState(0);
  const [price, setPrice] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);
  const [percentage, setPercentage] = useState(100);
  const [previousPercentage, setPreviousPercentage] = useState(100);

  const [maxTank, setMaxTank] = useState(0);

  const container = document.getElementById("fuelContainer");

  useEffect(() => {
    db.cars.get({ id: carId }).then((car) => {
      console.debug({ car });
      setMaxTank(car["maxTank"]);
      db.fuelFillUps
        .orderBy("timeUtc")
        .reverse()
        .filter((value) => value["carId"] === carId)
        .limit(1)
        .each((value) => {
          console.debug({ value });
          const container = document.getElementById("fuelContainer");
          const fuelConsumption = value["tankFilled"] / car["maxTank"];
          const fuelLevel =
            container.offsetHeight - container.offsetHeight * fuelConsumption;

          setPercentage(fuelConsumption * 100);
          setPreviousPercentage(fuelConsumption * 100);
          setFuelTank(fuelLevel);
          setPreviousFuelTank(fuelLevel);
          setPrice(value["price"]);
          setPreviousPrice(value["price"]);
        });
    });
  }, [carId]);

  const handleClick = (event) => {
    const computedYCoord = event.clientY - container.offsetTop;
    const computedPercentage =
      (1 - computedYCoord / container.offsetHeight) * 100;

    console.debug({ computedPercentage, computedYCoord });

    setFuelTank(computedYCoord);
    setPercentage(computedPercentage);
  };

  const handleSave = () => {
    const timeUtc = Date.now();
    const actualFuel = (percentage / 100) * maxTank;

    db.fuelFillUps
      .add({
        carId,
        price,
        tankFilled: actualFuel,
        timeUtc,
      })
      .then((id) => {
        console.log(`db entry saved at ${id}`);
        setPreviousFuelTank(fuelTank);
        setPreviousPrice(price);
        setPreviousPercentage(percentage);
        db.events.add({ carId, type: EventTypes.fuelUp, timeUtc });
      });
  };

  const fuelGaugeStyle = {
    top: fuelTank.toFixed(2) + "px",
  };

  console.debug({ fuelGaugeStyle });

  let stringifiedValue = price.toFixed(2).toString();
  if (stringifiedValue.length < 8) {
    // we add the zero to the front to enable overflows
    stringifiedValue = "0" + stringifiedValue;
  }

  const incrementPrice = (baseValue, index) => {
    const newValue = baseValue + Math.pow(10, index);
    console.debug({ newValue });
    setPrice(newValue);
  };

  const decrementPrice = (baseValue, index) => {
    let newValue = baseValue - Math.pow(10, index);
    if (newValue < 0) {
      newValue = 0;
    }
    console.debug({ newValue });
    setPrice(newValue);
  };

  const increaseCents = (baseValue, index) => {
    const baseTen = Math.pow(10, index);

    const newValue = baseValue + baseTen / 100;
    console.debug({ newValue, baseValue, index, baseTen });
    setPrice(newValue);
  };

  const decreaseCents = (baseValue, index) => {
    const baseTen = Math.pow(10, index);

    let newValue = baseValue - baseTen / 100;

    if (newValue < 0) {
      newValue = 0;
    }
    console.debug({ newValue, baseValue, index });
    setPrice(newValue);
  };

  const resetPrice = () => {
    setPrice(previousPrice);
  };

  const resetFuelTank = () => {
    setFuelTank(previousFuelTank);
    setPercentage(previousPercentage);
  };

  return (
    <div>
      <h2>Resulting tank:</h2>
      <div className={styles.fuelTankHolder}>
        <div
          id="fuelContainer"
          className={styles.fuelTankContainer}
          onClick={handleClick}
        >
          <div className={styles.gasLevel} style={fuelGaugeStyle}></div>

          <div
            className={[styles.ninetyMark, styles.minorMark].join(" ")}
          ></div>
          <div
            className={[styles.eightyMark, styles.minorMark].join(" ")}
          ></div>
          <div
            className={[styles.seventyMark, styles.minorMark].join(" ")}
          ></div>
          <div className={[styles.sixtyMark, styles.minorMark].join(" ")}></div>
          <div className={[styles.fiftyMark, styles.majorMark].join(" ")}></div>
          <div
            className={[styles.fourtyMark, styles.minorMark].join(" ")}
          ></div>
          <div
            className={[styles.thirtyMark, styles.minorMark].join(" ")}
          ></div>
          <div
            className={[styles.twentyMark, styles.minorMark].join(" ")}
          ></div>
          <div className={[styles.tenMark, styles.minorMark].join(" ")}></div>
          <div className={[styles.zeroMark, styles.minorMark].join(" ")}></div>
        </div>
        <div>You are now at {percentage.toFixed(2)}% full</div>
      </div>

      <button
        className={[sharedButtons.button, styles.button].join(" ")}
        onClick={resetFuelTank}
      >
        Reset fuel tank
      </button>

      <h2>Total cost of fill up:</h2>
      <div className={styles.costSummary}>
        $
        {stringifiedValue.split("").map((character, index) => {
          if (character === ".") {
            // to ignore decimal places
            return <div key={index}>.</div>;
          } else if (index > stringifiedValue.indexOf(".")) {
            // check if the indexes are the last two digits
            const centIndex = 2 - index + stringifiedValue.indexOf(".");
            console.debug({
              index,
              fullStop: stringifiedValue.indexOf("."),
              calculated: centIndex,
            });
            return (
              <NumberIncrementer
                key={index}
                currentDigit={character}
                isHidden={index < stringifiedValue.length - 5}
                incrementDigit={() => {
                  console.log("incrementing cents");
                  increaseCents(price, centIndex);
                }}
                decrementDigit={() => {
                  decreaseCents(price, centIndex);
                }}
              />
            );
          } else {
            const newIndex = stringifiedValue.length - index - 1 - 3;
            return (
              <NumberIncrementer
                key={index}
                currentDigit={character}
                isHidden={index < stringifiedValue.length - 5}
                incrementDigit={() => {
                  incrementPrice(price, newIndex);
                }}
                decrementDigit={() => {
                  decrementPrice(price, newIndex);
                }}
              />
            );
          }
        })}
      </div>

      <button
        className={[
          sharedButtons.button,
          styles.button,
          styles.fuelUpButton,
        ].join(" ")}
        onClick={handleSave}
      >
        Add fuel
      </button>

      <button
        className={[sharedButtons.button, styles.button].join(" ")}
        onClick={resetPrice}
      >
        Reset price
      </button>
    </div>
  );
}
