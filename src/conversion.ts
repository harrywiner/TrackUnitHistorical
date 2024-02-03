console.log("Hello World")

import { TrackUnitClassicDatum } from './types/TrackUnitClassicTypes';

import {Device, DeviceHistory} from './types/SkyfallAgentTypes';

export function TrackUnitToDeviceHistory(data: TrackUnitClassicDatum[], device: Device): DeviceHistory {

  let time = data[0].time;
  if (!data.every(e => e.time === time)) {
    throw new Error("Times are different");
  }

  var telemetry_data = {} as any;

  for (let datum of data) {
    telemetry_data[datum.name] = datum.value;
  }

  return {
    parentId: device._id,
    provider: "trackunit",
    deviceType: "generator",
    telemetry_data,
    createdDate: new Date(time)
  }
}

/**
 * Reads trackUnit api data and bins it by time. If there are not the correct number of telemetics in a bin, then it is deleted.
 * @param data Input TrackUnit API data
 * @param verbose 
 * @returns A list TrackUnit data snapshots
 */
export function binData(data: TrackUnitClassicDatum[], verbose=false): TrackUnitClassicDatum[][] {
  let binnedData = {} as any;

  // Bin Data by time
  for (let datum of data) {
    if (binnedData[datum.time]) {
      binnedData[datum.time].push(datum);
    } else {
      binnedData[datum.time] = [datum];
    }
  }



  // delete incomplete records
  for (let key of Object.keys(binnedData)) {
    if (binnedData[key].length < 20) {
      if (verbose)
        console.log("Deleted data with length: ", binnedData[key].length)

      delete binnedData[key];
    }
  }

  // take out of hash map
  const output = Object.values(binnedData);
  return output as TrackUnitClassicDatum[][];
}

export function sparsifyData(data: DeviceHistory[]): DeviceHistory[] {
  var startTime = new Date(data[0].createdDate);

  var sparseData = [] as any;

  for (let datum of data) {
    let time = new Date(datum.createdDate);
    let diff = time.getTime() - startTime.getTime();
    let hours = diff / 1000 / 60 / 60;
    if (hours > 1) {
      sparseData.push(datum);
      startTime = time;
    }
  }
  return sparseData;
}