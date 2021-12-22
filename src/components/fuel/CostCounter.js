import styles from "./CostCounter.module.css";
import NumberIncrementer from "../mileage/NumberIncrementer";

export default function CostCounter({
  startingValue,
  increaseCents,
  decreaseCents,
  incrementPrice,
  decrementPrice,
}) {
  let stringifiedValue = startingValue.toFixed(2).toString();
  if (stringifiedValue.length < 8) {
    // we add the zero to the front to enable overflows
    stringifiedValue = "0" + stringifiedValue;
  }
  return (
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
                increaseCents(startingValue, centIndex);
              }}
              decrementDigit={() => {
                decreaseCents(startingValue, centIndex);
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
                incrementPrice(startingValue, newIndex);
              }}
              decrementDigit={() => {
                decrementPrice(startingValue, newIndex);
              }}
            />
          );
        }
      })}
    </div>
  );
}
