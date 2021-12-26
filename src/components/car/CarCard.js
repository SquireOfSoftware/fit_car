import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarSide } from "@fortawesome/free-solid-svg-icons";
import styles from "./CarCard.module.css";

export default function CarCard({ car, activateCar }) {
  return (
    <div
      className={[
        styles.carCard,
        car["isActive"] === "true" ? styles.activeCar : "",
      ].join(" ")}
      onClick={() => activateCar(car)}
    >
      {car["isActive"] === "true" ? (
        <div className={styles.activeCarText}>This car is currently active</div>
      ) : (
        ""
      )}
      <FontAwesomeIcon icon={faCarSide} className={styles.carIcon} />
      <div>
        {car["name"] !== "" ? <div>name: {car.name}</div> : ""}
        <div>id: {car.id}</div>
        <div>style: {car.style}</div>
        <div>max tank: {car.maxTank}</div>
        <div>make: {car.make}</div>
      </div>
    </div>
  );
}
