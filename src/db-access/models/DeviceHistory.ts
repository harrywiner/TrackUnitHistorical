import mongoose, { Schema, Document } from 'mongoose';
import { DeviceHistory } from '../../types/SkyfallAgentTypes';

const deviceHistorySchema: Schema = new Schema<DeviceHistory>({
  parentId: { type: String, required: true },
  createdDate: { type: Date, required: true },
  provider: {type: String, required: true},
	telemetry_data: { type: Object, required: true },
	deviceType: {type: String, required: false},
  // Add other properties from the DeviceHistory class
});

const DeviceHistoryModel = mongoose.model<DeviceHistory & Document>('TUDeviceHistory', deviceHistorySchema);

export default DeviceHistoryModel;

