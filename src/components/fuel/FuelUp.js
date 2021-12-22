import styles from "./FuelUp.module.css";
import sharedStyles from "../SharedCard.module.css";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import FuelTank from "./FuelTank";

export default function FuelUp({ carId }) {
  return (
    <div className={styles.fuelUpPage}>
      <Breadcrumb uriSegments={["home", "fuel", "add"]} />
      <FuelTank carId={carId} />
    </div>
  );
}

export function FuelUpButton() {
  return (
    <div className={[sharedStyles.cardButton].join(" ")}>
      <div className={[sharedStyles.animatedCard].join(" ")}>
        <div className={[sharedStyles.animatedCardText].join(" ")}>
          Add Fuel
        </div>
      </div>
    </div>
  );
}
