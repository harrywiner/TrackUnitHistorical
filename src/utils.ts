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