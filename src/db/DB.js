import Dexie from "dexie";

export const db = new Dexie("fit_car");

db.version(6).stores({
  mileage: "++id, [carId+timeUtc], carId, mileage, timeUtc",
  cars: "++id, name, make, style, maxTank, isActive",
  fuelFillUps:
    "++id, [carId+timeUtc], carId, price, fuelType, previousTank, currentTank, timeUtc",
  events: "++id, carId, type, eventId, timeUtc",
  oilChecks: "++id, [carId+timeUtc], carId, timeUtc, percentage, opacity, action, note",
  tireChecks:
    "++id, [carId+timeUtc], topLeft, topRight, bottomLeft, bottomRight, carId, pressure, timeUtc",
});
// injecting test data
// db.cars.add({
//   isActive: "false",
//   make: "toyota",
//   maxTank: 70,
//   name: "Test",
//   style: "corolla",
// });
