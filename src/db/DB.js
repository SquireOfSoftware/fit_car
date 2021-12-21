import Dexie from "dexie";

export const db = new Dexie("fit_car");
db.version(1).stores({
  mileage: "++id, carId, currentMileage, timeUtc",
  cars: "++id, carName, carMake, carStyle",
  fuelFillUps: "++id, price, volume, tankFilled, timeUtc",
  events: "++id, type, timeUtc",
});
