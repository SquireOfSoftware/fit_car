import styles from "./FuelTank.module.css";
import sharedButtons from "../SharedButton.module.css";
import { useState, useEffect } from "react";
import { db } from "./../../db/DB";
import EventTypes from "../events/EventTypes";
import TankComponent from "./TankComponent";
import CostCounter from "./CostCounter";
import { getActiveCar } from "../GetActiveCar";

export default function FuelTank() {
  const [initialPrice, setInitialPrice] = useState(0);
  const [currentPrice, setPrice] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);

  const [initialTank, setInitialTank] = useState({
    pixelValue: 0,
    percentage: 100,
  });

  const [previousTank, setPreviousTank] = useState({
    pixelValue: 0,
    percentage: 100,
  });
  const [currentTank, setCurrentTank] = useState({
    pixelValue: 0,
    percentage: 100,
  });

  const [maxTank, setMaxTank] = useState(0);
  const [activeCar, setActiveCar] = useState(undefined);

  useEffect(() => {
    getActiveCar((car) => {
      console.debug({ car });
      setActiveCar(car);
      setMaxTank(car["maxTank"]);
      db.fuelFillUps
        .orderBy("timeUtc")
        .reverse()
        .filter((value) => value["carId"] === car["id"])
        .limit(1)
        .each((value) => {
          console.debug({ value });
          const container = document.getElementById("fuelContainer");
          const fuelConsumption = value["tankFilled"] / car["maxTank"];
          const fuelLevel =
            container.offsetHeight - container.offsetHeight * fuelConsumption;

          const tank = {
            pixelValue: fuelLevel,
            percentage: fuelConsumption * 100,
          };
          setPreviousTank(tank);
          setCurrentTank(tank);
          setInitialTank(tank);

          setInitialPrice(value["price"]);
          setPrice(value["price"]);
          setPreviousPrice(value["price"]);
        });
    });
  }, []);

  const handlePreviousFuelClick = (updatedTank) => {
    console.debug({ updatedTank });
    setPreviousTank(updatedTank);
  };

  const handleSave = () => {
    const timeUtc = Date.now();
    const actualFuel = (currentTank.percentage / 100) * maxTank;

    db.fuelFillUps
      .add({
        carId: activeCar["id"],
        price: currentPrice,
        tankFilled: actualFuel,
        timeUtc,
      })
      .then((id) => {
        setInitialPrice(currentPrice);
        setPreviousPrice(currentPrice);

        const newTank = {
          pixelValue: currentTank.pixelValue,
          percentage: currentTank.percentage,
        };
        setPreviousTank(newTank);
        setInitialTank(newTank);

        db.events.add({
          carId: activeCar["id"],
          type: EventTypes.fuelUp,
          timeUtc,
        });
      });
  };

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
    setPrice(initialPrice);
  };

  const resetFuelTank = () => {
    setCurrentTank({
      pixelValue: initialTank.pixelValue,
      percentage: initialTank.percentage,
    });
  };

  const currentTankDelta =
    ((currentTank.percentage - previousTank.percentage) / 100) * maxTank;

  console.debug({
    previousTank,
    currentTank,
    maxTank,
    currentTankInLiters: currentTankDelta,
  });

  return (
    <div>
      <h2>Resulting tank:</h2>
      <div className={styles.fuelTankHolder}>
        <TankComponent
          description="Before"
          clickCallback={handlePreviousFuelClick}
          currentTank={previousTank}
          customClass={"before"}
        />
        {/* <TankComponent
          description="After"
          handleClick={handleClick}
          fuelGaugeStyle={fuelGaugeStyle}
          customClass={"after"}
        /> */}
        <div>You are now at {currentTank.percentage.toFixed(2)}% full</div>
      </div>

      {previousTank.pixelValue !== currentTank.pixelValue ? (
        <>
          <div>You are adding {currentTankDelta} L</div>
          <button
            className={[sharedButtons.button, styles.button].join(" ")}
            onClick={resetFuelTank}
          >
            Reset fuel tank
          </button>
        </>
      ) : (
        ""
      )}

      <h2>Total cost of fill up:</h2>
      <CostCounter
        startingValue={currentPrice}
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

      {previousPrice !== currentPrice ? (
        <button
          className={[sharedButtons.button, styles.button].join(" ")}
          onClick={resetPrice}
        >
          Reset price
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
