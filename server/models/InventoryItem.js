import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },

    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    unit: {
      type: String,
      default: 'units',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  'InventoryItem',
  inventoryItemSchema
);