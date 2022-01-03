import styles from "./AddOilCheckPage.module.css";
import sharedStyles from "../SharedCard.module.css";
import { useState } from "react";

export default function AddOilCheckPage() {
  const [oilLevel, setOilLevel] = useState(100);
  const [oilColour, setOilColour] = useState(0);

  const changeOilColour = (event) => {
    console.log(event.target.value);
    setOilColour(event.target.value);
  };

  const changeOilLevel = (event) => {
    setOilLevel(event.target.value);
  };

  return (
    <>
      <div>
        {oilLevel} {oilColour}
      </div>
      <div>
        <input
          className={styles.oilLeveller}
          type="range"
          onChange={changeOilLevel}
          value={oilLevel}
          min="0"
          max="150"
        />
      </div>
      <div>
        <input
          type="range"
          onChange={changeOilColour}
          value={oilColour}
          lists={styles.tickmarks}
        />
        <datalist id={styles.tickmarks}>
          <option value="0" label="clear"></option>
          <option value="10"></option>
          <option value="20"></option>
          <option value="30"></option>
          <option value="40"></option>
          <option value="50"></option>
          <option value="60"></option>
          <option value="70"></option>
          <option value="80"></option>
          <option value="90"></option>
          <option value="100" label="foggy"></option>
        </datalist>
      </div>
    </>
  );
}

export function AddOilCheckButton() {
  return (
    <div className={[sharedStyles.cardButton].join(" ")}>
      <div className={[sharedStyles.animatedCard].join(" ")}>
        <div className={[sharedStyles.animatedCardText].join(" ")}>
          Add Oil Check
        </div>
      </div>
    </div>
  );
}
