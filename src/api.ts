const baseUrl = "https://api.trackunit.com/public"
const token = "e5b1e584d8814ea198a88b780ebb7161"

import { Device } from "./types/SkyfallAgentTypes";
import { TrackUnitClassicDatum } from "./types/TrackUnitClassicTypes";

export function findUnit(serialNumber: string): Promise<Device> {
  return fetch(`${baseUrl}/Unit?serialNumber=${serialNumber}&token=${token}`, { method: "GET" })
    .then(res => res.json())
    .then(data => {
      var device = data.list[0];
      return {
        deviceId: device.id,
        serialNumber: device.serialNumber,
        name: device.name,
        provider: "trackunit"
      } as Device
    })
    .catch(err => {
      // console.error("Error:", err);
      throw err;
    })
  }

export function getHistory(device: Device, startTime: Date, endTime: Date): Promise<TrackUnitClassicDatum[]> {
  if (startTime > endTime) {
    throw new Error("Start time is after end time");
  }

  return fetch(`${baseUrl}/Report/UnitExtendedInfo?id=${device.deviceId}&from=${startTime.toISOString()}&to=${endTime.toISOString()}&token=${token}`, 
    { method: "GET" })
    .then(res => res.json())
    .then(data => {
      return data.list as TrackUnitClassicDatum[];
    })
    .catch(err => {
      throw err;
    })

}