import styles from "./FuelTank.module.css";
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
  const [maxTank, setMaxTank] = useState(0);

  const container = document.getElementById("fuelContainer");

  useEffect(() => {
    db.cars.get({ id: carId }).then((car) => {
      console.log({ car });
      setMaxTank(car["maxTank"]);
      db.fuelFillUps
        .orderBy("timeUtc")
        .reverse()
        .filter((value) => value["carId"] === carId)
        .limit(1)
        .each((value) => {
          console.log(value);
          const container = document.getElementById("fuelContainer");
          const fuelConsumption = value["tankFilled"] / car["maxTank"];
          const fuelLevel =
            container.offsetHeight - container.offsetHeight * fuelConsumption;
          console.log({
            fuelLevel,
            fuelConsumption,
            tankFilled: value["tankFilled"],
            maxTank: car["maxTank"],
            parentTank: container.getBoundingClientRect(),
          });

          setPercentage(fuelConsumption * 100);
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

    console.log({ computedPercentage, computedYCoord });

    setFuelTank(computedYCoord);
    setPercentage(computedPercentage);
  };

  const handleSave = () => {
    const timeUtc = Date.now();
    const actualFuel = (percentage / 100) * maxTank;
    console.log({ actualFuel });

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
        db.events.add({ carId, type: EventTypes.fuelUp, timeUtc });
      });
  };

  const fuelGaugeStyle = {
    top: fuelTank.toFixed(2) + "px",
  };

  console.log({ fuelGaugeStyle });

  let stringifiedValue = price.toFixed(2).toString();
  if (stringifiedValue.length < 8) {
    // we add the zero to the front to enable overflows
    stringifiedValue = "0" + stringifiedValue;
  }

  const incrementPrice = (baseValue, index) => {
    const newValue = baseValue + Math.pow(10, index);
    console.log({ newValue });
    setPrice(newValue);
  };

  const decrementPrice = (baseValue, index) => {
    let newValue = baseValue - Math.pow(10, index);
    if (newValue < 0) {
      newValue = 0;
    }
    console.log({ newValue });
    setPrice(newValue);
  };

  const increaseCents = (baseValue, index) => {
    const baseTen = Math.pow(10, index);

    const newValue = baseValue + baseTen / 100;
    console.log({ newValue, baseValue, index, baseTen });
    console.log("debugging the cent increment");
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
  };

  return (
    <div>
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

      <button className={styles.button} onClick={resetFuelTank}>
        Reset fuel tank
      </button>

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

      <button className={styles.button} onClick={handleSave}>
        Add fuel
      </button>

      <button className={styles.button} onClick={resetPrice}>
        Reset price
      </button>
    </div>
  );
}
