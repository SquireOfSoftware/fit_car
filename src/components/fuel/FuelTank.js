import styles from "./FuelTank.module.css";
import sharedButtons from "../SharedButton.module.css";
import { useState, useEffect } from "react";
import { db } from "./../../db/DB";
import EventTypes from "../events/EventTypes";
import TankComponent from "./TankComponent";
import CostCounter from "./CostCounter";

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
        <TankComponent
          handleClick={handleClick}
          fuelGaugeStyle={fuelGaugeStyle}
        />
        <div>You are now at {percentage.toFixed(2)}% full</div>
      </div>

      <button
        className={[sharedButtons.button, styles.button].join(" ")}
        onClick={resetFuelTank}
      >
        Reset fuel tank
      </button>

      <h2>Total cost of fill up:</h2>
      <CostCounter
        startingValue={price}
        increaseCents={increaseCents}
        decrementCents={decreaseCents}
        incrementPrice={incrementPrice}
        decrementPrice={decrementPrice}
      />

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
