import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HelpRequest',
      required: true,
    },

    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    ratedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// A citizen can rate the volunteer only once for a request.
ratingSchema.index(
  {
    request: 1,
    ratedBy: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model('Rating', ratingSchema);