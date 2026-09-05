import mongoose from 'mongoose';

import Rating from '../models/Rating.js';
import HelpRequest from '../models/HelpRequest.js';
import User from '../models/User.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { notify } from '../utils/notify.js';

// Sprint 2 Feature 10:
// Citizen confirms that help was received and rates the volunteer.
// This completes the lifecycle:
//
// fulfilled -> closed
export const confirmAndRate = asyncHandler(async (req, res) => {
  const { requestId, stars, comment } = req.body;

  const request = await HelpRequest.findById(requestId);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (String(request.createdBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Only the person who posted the request can confirm it');
  }

  if (!request.claimedBy) {
    res.status(400);
    throw new Error('No volunteer claimed this request yet');
  }

  if (request.status !== 'fulfilled') {
    res.status(400);
    throw new Error(
      'You can only confirm a request once the volunteer marks it fulfilled'
    );
  }

  const numStars = Number(stars);

  if (!(numStars >= 1 && numStars <= 5)) {
    res.status(400);
    throw new Error('Stars must be between 1 and 5');
  }

  const rating = await Rating.create({
    request: request._id,
    ratedBy: req.user._id,
    ratedUser: request.claimedBy,
    stars: numStars,
    comment: comment || '',
  });

  request.status = 'closed';
  request.confirmedByCitizen = true;

  await request.save();

  // Recalculate the volunteer's average from all ratings.
  const aggregate = await Rating.aggregate([
    {
      $match: {
        ratedUser: new mongoose.Types.ObjectId(request.claimedBy),
      },
    },

    {
      $group: {
        _id: '$ratedUser',
        avg: {
          $avg: '$stars',
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  if (aggregate.length) {
    await User.findByIdAndUpdate(request.claimedBy, {
      ratingAvg:
        Math.round(aggregate[0].avg * 10) / 10,

      ratingCount:
        aggregate[0].count,
    });
  }

  await notify(
    request.claimedBy,
    `You received a ${numStars}★ rating for helping with a ${request.needType} request.`,
    'status',
    '/volunteer'
  );

  res.status(201).json({
    rating,
    request,
  });
});

// Public rating history for a volunteer.
export const getUserRatings = asyncHandler(async (req, res) => {
  const ratings = await Rating.find({
    ratedUser: req.params.id,
  })
    .populate('ratedBy', 'name')
    .populate('request', 'needType')
    .sort({
      createdAt: -1,
    });

  res.json(ratings);
});