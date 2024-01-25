import mongoose, { Schema, Document } from 'mongoose';
import { Device, Provider } from '../../types/SkyfallAgentTypes';

const deviceSchema: Schema = new Schema<Device>({
  deviceId: { type: String, required: true },
  name: { type: String, required: true },
  provider: {type: String, required: true},
  serialNumber: { type: String, required: true },
  // Add other properties from the Device class
});

const DeviceModel = mongoose.model<Device & Document>('Device', deviceSchema);

export default DeviceModel;
