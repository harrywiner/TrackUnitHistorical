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
    if (binnedData[key].length !== 25) {
      if (verbose)
        console.log("Deleted data with length: ", binnedData[key].length)

      delete binnedData[key];
    }
  }

  // take out of hash map
  const output = Object.values(binnedData);
  return output as TrackUnitClassicDatum[][];
}