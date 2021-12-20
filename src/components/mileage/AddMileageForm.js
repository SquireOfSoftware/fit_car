import { db } from "./../../db/DB";
import { useForm } from "react-hook-form";

export default function AddMileageForm(props) {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
  });

  async function addMileage(event) {
    let carId = props.carId;
    let currentMileage = parseInt(getValues("mileage"));
    let timeUtc = Date.now();

    try {
      const id = await db.mileage.add({
        carId,
        currentMileage,
        timeUtc,
      });
      console.log(`db entry saved at ${id}`);
    } catch (error) {
      console.log(`Failed to write to the browser db: ${error}`);
    }
  }

  const changeMileage = (event) => {
    let value = event.target.value;
    let numIsValid = !isNaN(value) && value.length > 0;
    setValue("mileage", numIsValid ? parseInt(value) : undefined, {
      shouldValidate: true,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(addMileage)}>
        <div onClick={addMileage}>hello world</div>
        <fieldset>
          <label>Mileage: </label>
          <input
            {...register("mileage", { required: true })}
            type="number"
            id="mileage"
            onChange={changeMileage}
          />
        </fieldset>
        {isValid ? <input type="submit" /> : <input type="submit" disabled />}
      </form>
    </>
  );
}
