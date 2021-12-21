import styles from "./App.module.css";
import { Outlet, Link } from "react-router-dom";
import { AddMileageButton } from "./components/mileage/AddMileageForm";

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.appHeader}>
        <p>Fit Car</p>
      </div>
      <nav className={styles.appNav}>
        <Link to="/addMileage">
          <AddMileageButton />
        </Link>
        <Link to="/readMileage">Read Mileage</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
