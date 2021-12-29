import styles from "./FuelTank.module.css";
import sharedButtons from "../SharedButton.module.css";
import { useState, useEffect } from "react";
import { db } from "./../../db/DB";
import EventTypes from "../events/EventTypes";
import TankComponent from "./TankComponent";
import CostCounter from "./CostCounter";
import { getActiveCar } from "../DBHelperFunctions";
import { FuelType } from "../car/CarInfo";

export default function FuelTank() {
  const [initialPrice, setInitialPrice] = useState(0);
  const [currentPrice, setPrice] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);

  const [initialTank, setInitialTank] = useState({
    pixelValue: 0,
    percentage: 100,
  });
  const [fuelType, setFuelType] = useState(FuelType.E10);

  const previousTankId = "fuelContainer-before";
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
          const container = document.getElementById(previousTankId);
          const fuelConsumption = value["currentTank"] / car["maxTank"];
          const fuelLevel =
            container.offsetHeight - container.offsetHeight * fuelConsumption;

          const tank = {
            pixelValue: fuelLevel,
            percentage: fuelConsumption * 100,
          };

          console.debug({ tank });

          setPreviousTank(tank);
          setCurrentTank(tank);
          setInitialTank(tank);
          setFuelType(value["fuelType"]);

          setInitialPrice(value["price"]);
          setPrice(value["price"]);
          setPreviousPrice(value["price"]);
        });
    });
  }, []);

  // we always assume that it should be greater than the previous tank
  const handleNewTankClick = (updatedTank) => {
    if (updatedTank.percentage < previousTank.percentage) {
      setCurrentTank(previousTank);
    } else {
      setCurrentTank(updatedTank);
    }
  };

  const handlePreviousFuelClick = (updatedTank) => {
    console.debug({ updatedTank });
    setPreviousTank(updatedTank);
  };

  const handleSave = () => {
    const timeUtc = Date.now();
    const previousFuel = (previousTank.percentage / 100) * maxTank;
    const actualFuel = (currentTank.percentage / 100) * maxTank;

    db.fuelFillUps
      .add({
        carId: activeCar["id"],
        price: currentPrice,
        currentTank: actualFuel,
        previousTank: previousFuel,
        fuelType,
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
          eventId: id,
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
    setCurrentTank(initialTank);
    setPreviousTank(initialTank);
  };
  const changeFuelType = (event) => {
    console.debug({ fuelType: event.target.value });
    setFuelType(event.target.value);
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
      <div className={styles.fuelTankHolder}>
        <TankComponent
          description="Before filling up"
          clickCallback={handlePreviousFuelClick}
          currentTank={previousTank}
          initialTank={initialTank}
          customClass={"before"}
        />
        <TankComponent
          description="After filling up"
          clickCallback={handleNewTankClick}
          currentTank={currentTank}
          initialTank={initialTank}
          customClass={"after"}
        />
      </div>

      {currentTankDelta !== 0 ? (
        <>
          <div className={styles.tankDelta}>
            You are adding {currentTankDelta.toFixed(2)} L
          </div>
          <button
            className={[sharedButtons.button, styles.button].join(" ")}
            onClick={resetFuelTank}
          >
            Reset fuel tanks
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

      <FuelTypeDropdDown
        changeFuelType={changeFuelType}
        selectedFuelType={fuelType}
      />

      <h2>Summary</h2>
      <FillUpSummary
        currentPrice={currentPrice}
        currentTank={currentTank}
        previousTank={previousTank}
        maxTank={maxTank}
        fuelType={fuelType}
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
    </div>
  );
}

function FuelTypeDropdDown({ changeFuelType, selectedFuelType }) {
  return (
    <div className={styles.fuelTypeDropdown}>
      <label htmlFor="fuelType">Fuel Type: </label>
      <select
        id="fuelType"
        name="fuelType"
        className={styles.fuelTypeOption}
        onChange={changeFuelType}
      >
        {Object.keys(FuelType).map((fuelTypeEnum, index) => {
          if (fuelTypeEnum === selectedFuelType) {
            return (
              <option value={fuelTypeEnum} key={index} selected="selected">
                {fuelTypeEnum}
              </option>
            );
          }
          return (
            <option value={fuelTypeEnum} key={index}>
              {fuelTypeEnum}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function FillUpSummary({
  currentPrice,
  currentTank,
  previousTank,
  maxTank,
  fuelType,
}) {
  const tankDelta =
    ((currentTank.percentage - previousTank.percentage) / 100) * maxTank;

  return (
    <div className={styles.fillUpSummary}>
      <div>
        Today's {fuelType} will cost you: ${currentPrice.toFixed(2)} for{" "}
        {tankDelta.toFixed(2)} L
      </div>
      <div>Which is roughly ${(tankDelta / currentPrice).toFixed(2)} per L</div>
    </div>
  );
}
