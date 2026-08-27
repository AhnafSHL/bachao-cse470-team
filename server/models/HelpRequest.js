import mongoose from 'mongoose';
import { locationSchema } from './User.js';

// Sprint 1: citizen help request. Later sprints will extend the lifecycle.
const helpRequestSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    needType: {
      type: String,
      enum: ['food', 'water', 'medicine', 'rescue', 'shelter'],
      required: true,
    },
    description: { type: String, default: '' },
    peopleAffected: { type: Number, default: 1, min: 1 },
    location: { type: locationSchema, required: true },
    urgency: { type: String, enum: ['normal', 'high', 'sos'], default: 'normal' },
    status: {
      type: String,
      enum: ['open'],
      default: 'open',
    },
  },
  { timestamps: true }
);

export default mongoose.model('HelpRequest', helpRequestSchema);
