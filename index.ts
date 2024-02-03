import { TrackUnitClassicDatum } from "./src/types/TrackUnitClassicTypes";
import { readSample } from "./src/utils";
import { TrackUnitToDeviceHistory, binData, sparsifyData} from "./src/conversion";
import { Device, DeviceHistory } from "./src/types/SkyfallAgentTypes";
import { findUnit, getHistory } from "./src/api";

import fs from "fs";
import mongoose from "mongoose";
import DeviceHistoryModel from "./src/db-access/models/DeviceHistory";
import DeviceModel from "./src/db-access/models/Device";
require('dotenv').config();

console.log("Hello Boozer!!")

if (process.env.MONGO_URI !== undefined) {
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // readBinWrite();
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });
} else {
  throw Error("MONGO_URI not defined");
}

async function writeDeviceHistory(device: Device, filename: string) {

  const deviceDocument = new DeviceModel(device);
  const savedDevice = await deviceDocument.save();
  device._id = savedDevice._id;

  const data = readSample(filename);

  const binnedData = binData(data);

  const output = [] as DeviceHistory[];
  for (var bin of binnedData) {
    const deviceHistory = TrackUnitToDeviceHistory(bin, device);
    // console.log(deviceHistory);
    output.push(deviceHistory);
  }

  const sparseData = sparsifyData(output);

  for (let datum of sparseData) {
    const deviceHistory = new DeviceHistoryModel(datum);
    await deviceHistory.save();
  }

}

const device: Device = {
  serialNumber: "5290349",
  name: "X5M00216",
  deviceId: "8351123",
  provider: "trackunit"
}

// writeDeviceHistory(device, 'data/historicalTelemetry8351123.json');

function readBinWrite() {
  const samplePath = 'data/historicalTelemetry8351123.json';

  const data = readSample(samplePath);

  const device: Device = {
    serialNumber: "5290349",
    name: "X5M00216",
    deviceId: "8351123",
    provider: "trackunit"
  }
  const binnedData = binData(data);

  const output = [] as DeviceHistory[];
  for (var bin of binnedData) {
    const deviceHistory = TrackUnitToDeviceHistory(bin, device);
    // console.log(deviceHistory);
    output.push(deviceHistory);
  }

  const sparseData = sparsifyData(output);
  
  const outputPath = 'data/sparseHistory.json';
  fs.writeFileSync(outputPath, JSON.stringify(sparseData, null, 2));
  console.log(`Output written to ${outputPath}`);
}

async function binAndWriteData(device: Device, history: TrackUnitClassicDatum[]) {
    let binnedData = binData(history, true);

    const deviceDocument = new DeviceModel(device);
    const savedDevice = await deviceDocument.save();
    device._id = savedDevice._id;

    const output = [] as DeviceHistory[];
    for (var bin of binnedData) {
      const deviceHistory = TrackUnitToDeviceHistory(bin, device);
      // console.log(deviceHistory);
      output.push(deviceHistory);
    }

  const sparseData = sparsifyData(output);

  let promises = [] as Promise<any>[];
  for (let datum of sparseData) {
    const deviceHistory = new DeviceHistoryModel(datum);
    promises.push(deviceHistory.save());
  }
  await Promise.all(promises);
  return
}

const serialNumbers = ["5290350", "5187249", "5290348",]

const startTime = new Date("2023-12-29T00:00:00.0000000")
const endTime = new Date("2024-01-02T00:00:00.0000000")

async function findDeviceWriteHistory(serialNumbers: string[], startTime: Date, endTime: Date) {
  for (let sn of serialNumbers) {
    let device = await findUnit(sn)
    let history = await getHistory(device, startTime, endTime)
    if (history.length === 0) {
      console.log(`No history found for ${sn}`);
      continue;
    }

    binAndWriteData(device, history)
  }
}

findDeviceWriteHistory(serialNumbers, startTime, endTime)
// readBinWrite()