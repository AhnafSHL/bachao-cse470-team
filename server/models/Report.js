import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: [
        'HelpRequest',
        'Organization',
        'User',
      ],
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'pending',
        'reviewed',
        'dismissed',
      ],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  'Report',
  reportSchema
);