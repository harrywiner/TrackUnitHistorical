import { ObjectId } from "bson";

export type Device = { 
	_id?: ObjectId
	deviceId: string, // TrackUnit classic id
	name: string, //ces asset id
	serialNumber: string,
	provider: "trackunit"
}

export type DeviceHistory = {
	parentId?: ObjectId, // foreign id to Device collection
	provider: "trackunit",
	telemetry_data: any,
	deviceType: "generator",
	createdDate: Date
}