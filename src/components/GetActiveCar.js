import { db } from "./../db/DB";

export function getActiveCar(callback) {
  return db.cars.where({ isActive: "true" }).toArray((cars) => {
    if (cars > 1) {
      throw new Error(
        `Well something went wrong here, we found ${cars.length} active cars, we only expected one`
      );
    } else if (cars.length === 0) {
      throw new Error(
        "We found no active cars, this means you need to create and configure a car for these stats to align to"
      );
    } else {
      console.debug({ cars });
      callback(cars[0]);
    }
  });
}
