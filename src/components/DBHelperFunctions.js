import { db } from "../db/DB";
import dayjs from "dayjs";

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

export function getEvents(start, end) {
  const eventPromise = db.events.where("timeUtc");
  if (end > start) {
    return eventPromise.between(start, end).toArray();
  } else if (end === start) {
    return eventPromise.equals(start).toArray();
  } else {
    return eventPromise.between(end, start).toArray();
  }
}

export function getMileageEvents(carId, start, end) {
  console.debug({
    carId,
    start,
    end,
  });
  const eventPromise = db.mileage.where(["carId", "timeUtc"]);
  if (end > start) {
    return eventPromise
      .between([carId, start], [carId, end])
      .reverse()
      .sortBy("timeUtc");
  } else if (end === start) {
    return eventPromise.equals([carId, start]).reverse().sortBy("timeUtc");
  } else {
    return eventPromise
      .between([carId, end], [carId, start])
      .reverse()
      .sortBy("timeUtc");
  }
}

export function getFuelUpEvents(carId, start, end) {
  const eventPromise = db.fuelFillUps.where(["carId", "timeUtc"]);
  if (end > start) {
    return eventPromise
      .between([carId, start], [carId, end])
      .reverse()
      .sortBy("timeUtc");
  } else if (end === start) {
    return eventPromise.equals([carId, start]).reverse().sortBy("timeUtc");
  } else {
    return eventPromise
      .between([carId, end], [carId, start])
      .reverse()
      .sortBy("timeUtc");
  }
}

export function getLastOilCheckEvent(carId, timeStamp) {
  return db.oilChecks
    .where(["carId", "timeUtc"])
    .between([carId, 0], [carId, timeStamp])
    .reverse()
    .limit(1)
    .sortBy("timeUtc");
}

export function getLastTireCheckEvent(carId, timeStamp) {
  return db.tireChecks
    .where(["carId", "timeUtc"])
    .between([carId, 0], [carId, timeStamp])
    .reverse()
    .limit(1)
    .sortBy("timeUtc");
}

export function addTireCheckEvent(event) {
  const timeUtc = dayjs().valueOf();
  return db.tireChecks.add({
    ...event,
    timeUtc,
  });
}
