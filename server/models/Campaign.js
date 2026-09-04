import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    goalAmount: {
      type: Number,
      default: 0,
    },

    raisedAmount: {
      type: Number,
      default: 0,
    },

    distributedAmount: {
      type: Number,
      default: 0,
    },

    type: {
      type: String,
      enum: ['money', 'goods'],
      default: 'money',
    },

    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },

    district: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  'Campaign',
  campaignSchema
);