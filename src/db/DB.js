import Dexie from "dexie";

export const db = new Dexie("fit_car");

db.version(3).stores({
  mileage: "++id, carId, currentMileage, timeUtc",
  cars: "++id, name, make, style, maxTank, isActive",
  fuelFillUps: "++id, carId, price, previousTank, currentTank, timeUtc",
  events: "++id, carId, type, timeUtc",
});
