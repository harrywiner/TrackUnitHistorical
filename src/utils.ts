import fs from 'fs';

import { TrackUnitClassicDatum } from './types/TrackUnitClassicTypes';


export function readSample(filename: string): TrackUnitClassicDatum[] {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data)["list"];
  } catch (err) {
    throw err;
  }
}

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