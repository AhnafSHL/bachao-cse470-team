import mongoose from 'mongoose';

export const locationSchema = new mongoose.Schema(
  {
    district: { type: String, default: '' },
    upazila: { type: String, default: '' },
    coords: { type: [Number], default: [90.4125, 23.8103] },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: '' },
    role: {
      type: String,
      enum: ['citizen', 'volunteer', 'donor', 'org_admin', 'admin'],
      default: 'citizen',
    },
    location: { type: locationSchema, default: () => ({}) },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // Sprint 2: volunteer reputation from citizen ratings.
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);