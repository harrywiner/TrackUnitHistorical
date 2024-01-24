import { ObjectId } from "bson";

type Device = { 
	_id: ObjectId
	deviceId: string, // TrackUnit classic id
	name: string, //ces asset id
	serialNumber: string,
	provider: "trackunit"
}

type DeviceHistory = {
	name: string,
	deviceId: ObjectId, // foreign id to Device collection
	provider: "trackunit",
	telemetry_data: any
}