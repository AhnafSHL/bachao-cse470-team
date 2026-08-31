import mongoose from 'mongoose';

const distributionLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'HelpRequest' },
    itemsGiven: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    peopleHelped: { type: Number, default: 0 },
    area: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('DistributionLog', distributionLogSchema);