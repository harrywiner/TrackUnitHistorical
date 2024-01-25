import { TrackUnitClassicDatum } from "./src/types/TrackUnitClassicTypes";
import { readSample } from "./src/utils";
import { TrackUnitToDeviceHistory, binData, sparsifyData} from "./src/conversion";
import { Device, DeviceHistory } from "./src/types/SkyfallAgentTypes";

import fs from "fs";

console.log("Hello Boozer!!")


// console.log(sample);

function sortCheck(data: TrackUnitClassicDatum[]) {
  for (let i = 0; i < data.length - 1; i++) {
    if (data[i].time > data[i + 1].time) {
      throw new Error('Data is not sorted');
    }
  }
}

function countTimes(data: TrackUnitClassicDatum[]) {
  let occurrences = {} as any;

  for (let i = 0; i < data.length; i++) {
    const value = data[i].time;
    if (occurrences[value]) {
      occurrences[value] += 1;
    } else {
      occurrences[value] = 1;
    }
  }

  return occurrences
}

function validityChecks() {
  const samplePath = 'data/historicalTelemetry8351123.json';

  const sample = readSample(samplePath);

  try {
    sortCheck(sample);
    console.log("Tests passed!")
  } catch (err) {
    console.log("Tests Failed", err);
  }
  try {
    let occurrences = countTimes(sample);

    let count25 = 0;
    let countNot25 = 0;
    let not25 = [] as any;
    for (let key of Object.keys(occurrences)) {
      if (occurrences[key] === 25) {
        count25 += 1;
      } else {
        countNot25 += 1;
        not25.push(occurrences[key]);
      }
    }
    console.log(occurrences)
    console.log("count25", count25);
    console.log("countNot25", countNot25);
    console.log("not25", not25);
    
  } catch (err) {
    console.log(err); 
  }
}

// validityChecks();

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
    console.log(deviceHistory);
    output.push(deviceHistory);
  }

  const sparseData = sparsifyData(output);
  
  const outputPath = 'data/sparseHistory.json';
  fs.writeFileSync(outputPath, JSON.stringify(sparseData, null, 2));
  console.log(`Output written to ${outputPath}`);
}

readBinWrite()