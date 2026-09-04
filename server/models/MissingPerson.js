import mongoose from 'mongoose';

const missingPersonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
    },

    photoUrl: {
      type: String,
      default: '',
    },

    lastSeenLocation: {
      district: {
        type: String,
        default: '',
      },

      upazila: {
        type: String,
        default: '',
      },
    },

    description: {
      type: String,
      default: '',
    },

    contact: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: [
        'missing',
        'found',
      ],
      default: 'missing',
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  'MissingPerson',
  missingPersonSchema
);