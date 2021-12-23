import Breadcrumb, { BreadcrumbIndicies } from "../breadcrumb/Breadcrumb";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { CarMakes, CarStyles } from "./CarInfo";

export default function AddCarPage() {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
  });

  const [make, setMake] = useState(CarMakes.toyota);
  const [carStyle, setStyle] = useState(CarStyles.corolla);
  const [name, setName] = useState("");
  const [maxTank, setMaxTank] = useState(70);

  const addCar = () => {
    console.log({ make, carStyle });
  };

  const changeMake = (event) => {
    console.log(event);
    setMake(event.target.value);
  };

  const changeStyle = (event) => {
    console.log(event.target.value);
    setStyle(event.target.value);
  };

  return (
    <>
      <Breadcrumb
        uriSegments={[
          BreadcrumbIndicies.home,
          BreadcrumbIndicies.cars,
          BreadcrumbIndicies.add,
        ]}
      />
      <form onSubmit={handleSubmit(addCar)}>
        <fieldset>
          <label htmlFor="make">Make: </label>
          <select
            {...register("make", { required: true })}
            id="make"
            name="make"
            onChange={changeMake}
          >
            {Object.keys(CarMakes).map((make, index) => {
              return (
                <option value={make} key={index}>
                  {CarMakes[make]}
                </option>
              );
            })}
          </select>
          <label htmlFor="style">Style: </label>
          <select
            {...register("style", { required: true })}
            id="style"
            name="style"
            onChange={changeStyle}
          >
            {Object.keys(CarStyles).map((carStyle, index) => {
              return (
                <option value={carStyle} key={index}>
                  {CarStyles[carStyle]}
                </option>
              );
            })}
          </select>
        </fieldset>
        {isValid ? <input type="submit" /> : <input type="submit" disabled />}
      </form>
    </>
  );
}
