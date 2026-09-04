import mongoose from 'mongoose';
import { locationSchema } from './User.js';

const shelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: locationSchema, required: true },
    capacity: { type: Number, default: 0 },
    currentOccupancy: { type: Number, default: 0 },
    facilities: { type: [String], default: [] },
    managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contact: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Shelter', shelterSchema);