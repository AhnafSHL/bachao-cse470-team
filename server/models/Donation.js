import mongoose from 'mongoose';

const donationSchema =
  new mongoose.Schema(
    {
      campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
      },

      donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      amount: {
        type: Number,
        default: 0,
      },

      itemDescription: {
        type: String,
        default: '',
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  'Donation',
  donationSchema
);