import { db } from "./../../db/DB";
import styles from "./AddOilCheckPage.module.css";
import sharedStyles from "../SharedCard.module.css";
import sharedButtons from "../SharedButton.module.css";
import { getActiveCar, getLastOilCheckEvent } from "../DBHelperFunctions";
import dayjs from "dayjs";

import { useState, useEffect } from "react";
import Breadcrumb, { BreadcrumbIndicies } from "../breadcrumb/Breadcrumb";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTint } from "@fortawesome/free-solid-svg-icons";

export default function AddOilCheckPage() {
  const [oilLevel, setOilLevel] = useState(0);
  const [oilPercentage, setOilPercentage] = useState(150);
  const [oilColour, setOilColour] = useState(20);
  const [oilText, setOilText] = useState(determineOpacityValue(oilColour));
  const [oilAction, setOilAction] = useState(OilAction.topUp);
  const [activeCar, setActiveCar] = useState(undefined);

  const [initialOilLevel, setInitialOilLevel] = useState(oilLevel);
  const [initialOilColour, setInitialOilColour] = useState(oilColour);
  const [initialOilPercentage, setInitialOilPercentage] =
    useState(oilPercentage);

  const id = "container";

  const currentStyle = {
    top: oilLevel.toFixed(2) + "px",
    opacity: oilColour + "%",
    backgroundColor: getColour(oilColour),
  };

  console.debug({ currentStyle });

  useEffect(() => {
    // find the active car
    getActiveCar((car) => {
      setActiveCar(car);
      const currentTime = dayjs();

      getLastOilCheckEvent(car["id"], currentTime.valueOf()).then((result) => {
        if (result.length !== 0) {
          const oilOpacity = result[0]["opacity"];
          const oilPercentage = result[0]["percentage"];
          setOilColour(oilOpacity);
          setOilText(determineOpacityValue(oilOpacity));
          setOilPercentage(oilPercentage);

          setInitialOilColour(oilOpacity);
          setInitialOilPercentage(oilPercentage);

          const container = document.getElementById(id);
          const computedPercentage =
            container.offsetHeight * (1 - oilPercentage / 150);
          setOilLevel(computedPercentage);
          console.debug({ oilOpacity, oilPercentage, computedPercentage });

          setInitialOilLevel(computedPercentage);
        }
      });
    });
  }, []);

  const changeOilColour = (event) => {
    let oilOpacity = event.target.value;
    setOilColour(oilOpacity);
    setOilText(determineOpacityValue(oilOpacity));
  };

  const changeOilLevel = (event) => {
    // the oil level must range from 0 to 150%
    const container = document.getElementById(id);
    const computedYCoord =
      event.clientY - container.offsetParent.offsetTop - container.offsetTop;
    const computedPercentage =
      (1 - computedYCoord / container.offsetHeight) * 150;
    console.debug({
      computedPercentage,
      computedYCoord,
      clientY: event.clientY,
      offsetTop: container.offsetTop,
    });
    setOilLevel(computedYCoord);
    setOilPercentage(computedPercentage);
  };

  const resetOilLevel = () => {
    setOilLevel(initialOilLevel);
    setOilPercentage(initialOilPercentage);
    setOilColour(initialOilColour);
  };

  const changeOilAction = (event) => {
    setOilAction(event.target.value);
  };

  const handleSave = () => {
    const timeUtc = dayjs().valueOf();
    const newOilCheck = {
      timeUtc,
      carId: activeCar["id"],
      percentage: oilPercentage,
      opacity: oilColour,
      action: oilAction,
    };
    console.debug({ newOilCheck });
    db.oilChecks.add(newOilCheck).then((_) => {
      setInitialOilColour(oilColour);
      setInitialOilLevel(oilLevel);
      setInitialOilPercentage(oilPercentage);
      setOilAction(OilAction.topUp);
    });
  };

  return (
    <>
      <Breadcrumb
        uriSegments={[
          BreadcrumbIndicies.home,
          BreadcrumbIndicies.oil,
          BreadcrumbIndicies.add,
        ]}
      />
      <div className={styles.container}>
        <div
          id={id}
          className={[styles.fuelTankContainer].join(" ")}
          onClick={changeOilLevel}
        >
          <div className={styles.gasLevel} style={currentStyle}></div>
          <div
            className={[styles.hundredFortyMark, styles.minorMark].join(" ")}
          ></div>
          <div
            className={[styles.hundredFortyMark, styles.minorMark].join(" ")}
          ></div>
          <div
            className={[styles.hundredThirtyMark, styles.minorMark].join(" ")}
          ></div>
          <div
            className={[styles.hundredTwentyMark, styles.minorMark].join(" ")}
          ></div>
          <div
            className={[styles.hundredTenMark, styles.mainorMark].join(" ")}
          ></div>
          <div
            className={[styles.hundredMark, styles.majorMark].join(" ")}
          ></div>
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
      </div>
      <div className={styles.summary}>
        <div>
          Oil is {oilPercentage.toFixed(2)}% full and is {oilText}.{" "}
        </div>
        {oilColour > 80 ? (
          <div className={styles.warning}>Your oil may need changing</div>
        ) : (
          ""
        )}
      </div>
      <div>
        <label>This is an oil change</label>
        <OilActionDropdDown
          changeOilAction={changeOilAction}
          selectedOilAction={oilAction}
        />
      </div>
      <div>
        <h2>Oil colour</h2>
        <input
          type="range"
          onChange={changeOilColour}
          value={oilColour}
          lists={styles.tickmarks}
          className={styles.oilColourSlider}
          min="20"
          max="100"
          step="10"
        />
      </div>

      {oilLevel !== initialOilLevel || oilColour !== initialOilColour ? (
        <>
          <button
            className={[sharedButtons.button, styles.oilCheckButton].join(" ")}
            onClick={handleSave}
          >
            Add Oil Check
          </button>
          <button
            className={[sharedButtons.button, styles.resetOilCheckButton].join(
              " "
            )}
            onClick={resetOilLevel}
          >
            Reset oil check
          </button>
        </>
      ) : (
        ""
      )}
    </>
  );
}

// from here: https://carbuyerlabs.com/the-color-of-your-engine-oil-says-a-lot-so-pay-attention/
function determineOpacityValue(opacity) {
  if (opacity < 30) {
    return "clean";
  } else if (opacity < 70) {
    return "normal";
  } else {
    return "dark";
  }
}

function getColour(opacity) {
  if (opacity < 30) {
    return "lightgoldenrod";
  } else if (opacity < 70) {
    return "goldenrod";
  } else if (opacity < 90) {
    return "maroon";
  } else {
    return "black";
  }
}

function OilActionDropdDown({ changeOilAction, selectedOilAction }) {
  return (
    <div className={styles.fuelTypeDropdown}>
      <label htmlFor="fuelType">Fuel Type: </label>
      <select
        id="fuelType"
        name="fuelType"
        className={styles.fuelTypeOption}
        onChange={changeOilAction}
        value={selectedOilAction}
      >
        {Object.keys(OilAction).map((oilActionEnum, index) => {
          return (
            <option value={oilActionEnum} key={index}>
              {oilActionEnum}
            </option>
          );
        })}
      </select>
    </div>
  );
}

const OilAction = {
  topUp: "topUp",
  oilChange: "oilChange",
};

export function AddOilCheckButton() {
  return (
    <div className={[sharedStyles.cardButton].join(" ")}>
      <div
        className={[
          sharedStyles.animatedCard,
          styles.animatedOilCheckButton,
        ].join(" ")}
      >
        <div className={styles.animatedDrip}>
          <FontAwesomeIcon className={styles.oilDrip} icon={faTint} />
        </div>
        <div
          className={[sharedStyles.animatedCardText, styles.cardText].join(" ")}
        >
          Add Oil Check
        </div>
      </div>
    </div>
  );
}
