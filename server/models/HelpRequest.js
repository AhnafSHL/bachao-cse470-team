import mongoose from 'mongoose';
import { locationSchema } from './User.js';

// Sprint 1: citizen help request. Later sprints will extend the lifecycle.
// A citizen posts what they need and where.
// Sprint 2 extends the request lifecycle:
// open -> claimed -> fulfilled -> closed.
const helpRequestSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    needType: {
      type: String,
      enum: ['food', 'water', 'medicine', 'rescue', 'shelter', 'resource'],
      required: true,
    },
    description: { type: String, default: '' },
    peopleAffected: { type: Number, default: 1, min: 1 },
    location: { type: locationSchema, required: true },
    urgency: { type: String, enum: ['normal', 'high', 'sos'], default: 'normal' },
    status: {
      type: String,
      enum: ['open', 'claimed', 'fulfilled', 'closed'],
      default: 'open',
    },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    confirmedByCitizen: { type: Boolean, default: false },
    isResourceNeed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('HelpRequest', helpRequestSchema);
