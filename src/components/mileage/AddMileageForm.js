import { db } from "./../../db/DB";

export default function AddMileageForm() {
  async function addMileage() {
    let car_id = 1;
    let current_mileage = 100;
    let time_utc = Date.now();

    try {
      const id = await db.mileage.add({
        car_id,
        current_mileage,
        time_utc,
      });
      console.log(`db entry saved at ${id}`);
    } catch (error) {
      console.log(`Failed to write to the browser db: ${error}`);
    }
  }

  return <div onClick={addMileage}>hello world</div>;
}
