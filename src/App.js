import { useEffect } from "react";
import "./App.css";
import AddMileageForm from "./components/mileage/AddMileageForm";
import ReadMileage from "./components/mileage/ReadMileage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Fit Car</p>
      </header>
      <AddMileageForm carId={1} />
      <ReadMileage />
    </div>
  );
}

export default App;
