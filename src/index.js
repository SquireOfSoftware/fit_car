import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AddNewMileage } from "./components/mileage/AddMileageForm";
import ReadMileage from "./components/mileage/ReadMileage";
import Report from "./components/events/Report";
import FuelUp from "./components/fuel/FuelUp";
import EditCarPage from "./components/car/EditCarPage";
import ViewCarsPage from "./components/car/ViewCarsPage";
import AddCarPage from "./components/car/AddCarPage";
import AddOilCheckPage from "./components/oil/AddOilCheckPage";
import AddTireCheckPage from "./components/tire/AddTireCheckPage";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="mileage/add" element={<AddNewMileage />} />
      <Route path="mileage" element={<ReadMileage />} />
      <Route path="fuel/add" element={<FuelUp />} />
      <Route path="cars" element={<ViewCarsPage />} />
      <Route path="cars/add" element={<AddCarPage />} />
      <Route path="cars/:carId/edit" element={<EditCarPage />} />
      <Route path="report" element={<Report />} />
      <Route path="oil/add" element={<AddOilCheckPage />} />
      <Route path="tires/add" element={<AddTireCheckPage />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
