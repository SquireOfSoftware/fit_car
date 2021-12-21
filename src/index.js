import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes, useRoutes } from "react-router-dom";

import { AddNewMileage } from "./components/mileage/AddMileageForm";
import ReadMileage from "./components/mileage/ReadMileage";

const rootElement = document.getElementById("root");

ReactDOM.render(
  // routes,
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="addMileage" element={<AddNewMileage carId={1} />} />
      <Route path="readMileage" element={<ReadMileage carId={1} />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
