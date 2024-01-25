import { ObjectId } from "bson";

export type Device = { 
	_id?: ObjectId
	deviceId: string, // TrackUnit classic id
	name: string, //ces asset id
	serialNumber: string,
	provider: Provider
}

export type DeviceHistory = {
	parentId?: ObjectId, // foreign id to Device collection
	provider: Provider,
	telemetry_data: any,
	deviceType: "generator",
	createdDate: Date
}

export type Provider = "trackunit" | "powerside" | "samsara";