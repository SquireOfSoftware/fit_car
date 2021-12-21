import { useEffect } from "react";
import "./App.css";
import AddMileageForm, {
  AddNewMileage,
} from "./components/mileage/AddMileageForm";
import ReadMileage from "./components/mileage/ReadMileage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Fit Car</p>
      </header>
      <AddNewMileage carId={1} />
      <ReadMileage />
    </div>
  );
}

export default App;
