import Breadcrumb, { BreadcrumbIndicies } from "../breadcrumb/Breadcrumb";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CarMakes, CarStyles } from "./CarInfo";
import styles from "./AddCarPage.module.css";
import sharedButton from "../SharedButton.module.css";
import { db } from "./../../db/DB";
import { useNavigate } from "react-router-dom";

export default function AddCarPage() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
  });

  const [make, setMake] = useState(CarMakes.Toyota);
  const [carStyle, setStyle] = useState(CarStyles.Corolla);
  const [name, setName] = useState("");
  const [maxTank, setMaxTank] = useState(70);

  const [activeCarCount, setActiveCarCount] = useState(0);
  const [redirectEnabled, setRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    db.cars
      .where({ isActive: "true" })
      .count((carCount) => setActiveCarCount(carCount));
  }, []);

  const addCar = () => {
    // first we want to check if this car is the first car being
    // created, if it is, set the isActive flag to true
    const car = {
      make,
      style: carStyle,
      name,
      maxTank,
      // set it to true if this is your first car
      isActive: (activeCarCount === 0).toString(),
    };
    console.debug({ car });

    if (activeCarCount === 0) {
      setActiveCarCount(1);
    }

    db.cars
      .add({ ...car })
      .then((id) => {
        console.debug(`car created with id of ${id}`);
        if (car["isActive"] === "true") {
          setActiveCarCount(1);
        }
        setRedirect(true);
        navigate("/");
      })
      .catch((error) => {
        console.warn(`Failed to write to the browser db: ${error}`);
        if (car["isActive"] === "true") {
          setActiveCarCount(0);
        }
      });
  };

  const changeName = (event) => {
    setName(event.target.value);
  };

  const changeMake = (event) => {
    console.log(CarMakes[event.target.value]);
    setMake(CarMakes[event.target.value]);
  };

  const changeStyle = (event) => {
    console.log(CarStyles[event.target.value]);
    setStyle(CarStyles[event.target.value]);
  };

  const changeMaxTank = (event) => {
    const value = event.target.value;
    if (value > 0) {
      setMaxTank(value);
    } else {
      setMaxTank(0);
    }
  };

  return (
    <div className={styles.addCarPage}>
      <Breadcrumb
        uriSegments={[
          BreadcrumbIndicies.home,
          BreadcrumbIndicies.cars,
          BreadcrumbIndicies.add,
        ]}
      />
      {redirectEnabled ? (
        <>
          <p>
            The new car has been created, redirecting back to the car listings
          </p>
        </>
      ) : (
        <form className={styles.carForm} onSubmit={handleSubmit(addCar)}>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            {...register("name", { required: false })}
            className={styles.formField}
            onChange={changeName}
            value={name}
          />
          <label htmlFor="make">Make*: </label>
          <select
            {...register("make", { required: true })}
            id="make"
            name="make"
            className={styles.formField}
            onChange={changeMake}
          >
            {Object.keys(CarMakes).map((make, index) => {
              return (
                <option value={make} key={index}>
                  {make}
                </option>
              );
            })}
          </select>
          <label htmlFor="style">Style*: </label>
          <select
            {...register("style", { required: true })}
            id="style"
            name="style"
            className={styles.formField}
            onChange={changeStyle}
          >
            {Object.keys(CarStyles).map((carStyle, index) => {
              return (
                <option value={carStyle} key={index}>
                  {carStyle}
                </option>
              );
            })}
          </select>
          <label htmlFor="maxTank">Max Tank*: </label>
          <input
            {...register("maxTank", {
              required: true,
              validate: (value) => value > 0,
            })}
            id="maxTank"
            name="maxTank"
            value={maxTank}
            type="number"
            className={styles.formField}
            onChange={changeMaxTank}
          />
          {isValid && maxTank > 0 ? (
            <input
              className={[sharedButton.button, styles.submitButton].join(" ")}
              type="submit"
              value="Add car"
            />
          ) : (
            <input
              className={[sharedButton.button, styles.submitButton].join(" ")}
              type="submit"
              value="Add car"
              disabled
            />
          )}
          <div className={styles.legend}>* compulsory fields</div>
        </form>
      )}
    </div>
  );
}
