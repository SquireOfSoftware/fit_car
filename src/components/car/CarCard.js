import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarSide } from "@fortawesome/free-solid-svg-icons";
import styles from "./CarCard.module.css";

export default function CarCard({ car }) {
  return (
    <div className={styles.carCard}>
      <FontAwesomeIcon icon={faCarSide} />
      <div>
        {car.name !== undefined ? (
          <div className={car.isActive ? styles.activeCar:""}>
            {car.name} the {car.make} {car.style}
          </div>
        ) : (
          <>
            <div>id: {car.id}</div>
            <div>style: {car.style}</div>
            <div>max tank: {car.maxTank}</div>
            <div>make: {car.make}</div>
          </>
        )}
      </div>
    </div>
  );
}
