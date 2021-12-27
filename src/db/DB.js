import Dexie from "dexie";

export const db = new Dexie("fit_car");

db.version(1).stores({
  mileage: "++id, carId, mileage, timeUtc",
  cars: "++id, name, make, style, maxTank, isActive",
  fuelFillUps: "++id, carId, price, previousTank, currentTank, timeUtc",
  events: "++id, carId, type, eventId, timeUtc",
});
// injecting test data
// db.cars.add({
//   isActive: "false",
//   make: "toyota",
//   maxTank: 70,
//   name: "Test",
//   style: "corolla",
// });
