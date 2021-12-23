import Dexie from "dexie";

export const db = new Dexie("fit_car");
// db.version(1).stores({
//   mileage: "++id, carId, currentMileage, timeUtc",
//   cars: "++id, carName, carMake, carStyle, maxTank",
//   fuelFillUps: "++id, carId, price, tankFilled, timeUtc",
//   events: "++id, carId, type, timeUtc",
// });

db.version(2).stores({
  mileage: "++id, carId, currentMileage, timeUtc",
  cars: "++id, name, make, style, maxTank, isActive",
  fuelFillUps: "++id, carId, price, tankFilled, timeUtc",
  events: "++id, carId, type, timeUtc",
});

// {carName: 'cammy', carMake: 'toyota', carStyle: 'carolla', maxTank: 70, id: 2, isActive: true}
