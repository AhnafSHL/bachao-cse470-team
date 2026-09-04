import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      default: '',
    },

    areasServed: {
      type: [String],
      default: [],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    owner: {
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
  'Organization',
  organizationSchema
);