import styles from "./App.module.css";
import { Outlet, Link } from "react-router-dom";
import { AddMileageButton } from "./components/mileage/AddMileageForm";
import { ReportButton } from "./components/events/Report";
import { FuelUpButton } from "./components/fuel/FuelUp";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import { ViewCarsButton } from "./components/car/ViewCarsPage";

function App() {
  return (
    <div className={styles.app}>
      <Breadcrumb uriSegments={["home"]} />
      <div className={styles.appHeader}>
        <p>Fit Car</p>
      </div>
      <nav className={styles.appNav}>
        <Link to="/mileage/add">
          <AddMileageButton />
        </Link>
        <Link to="/fuel/add">
          <FuelUpButton />
        </Link>
        <Link to="/report">
          <ReportButton />
        </Link>
        <Link to="/cars">
          <ViewCarsButton />
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
