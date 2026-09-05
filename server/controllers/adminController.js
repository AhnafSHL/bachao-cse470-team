import Organization from '../models/Organization.js';
import User from '../models/User.js';
import HelpRequest from '../models/HelpRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notify } from '../utils/notify.js';

// GET /api/admin/orgs
export const getOrgsForReview =
  asyncHandler(async (req, res) => {
    const filter = {};

    if (
      req.query.pending ===
      'true'
    ) {
      filter.isVerified =
        false;
    }

    const orgs =
      await Organization.find(
        filter
      )
        .populate(
          'owner',
          'name email'
        )
        .sort({
          createdAt: -1,
        });

    res.json(orgs);
  });

// PUT /api/admin/orgs/:id/verify
export const verifyOrg =
  asyncHandler(async (req, res) => {
    const org =
      await Organization.findById(
        req.params.id
      );

    if (!org) {
      res.status(404);

      throw new Error(
        'Organization not found'
      );
    }

    org.isVerified =
      req.body.isVerified !==
      false;

    await org.save();

    await User.findByIdAndUpdate(
      org.owner,
      {
        isVerified:
          org.isVerified,
      }
    );

    await notify(
      org.owner,
      org.isVerified
        ? `Your organization "${org.name}" has been verified.`
        : `Your organization "${org.name}" verification was revoked.`,
      'admin',
      '/organizations'
    );

    res.json(org);
  });

// GET /api/admin/users
export const getUsers =
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.role) {
      filter.role =
        req.query.role;
    }

    const users =
      await User.find(filter)
        .select(
          '-passwordHash'
        )
        .sort({
          createdAt: -1,
        });

    res.json(users);
  });

// PUT /api/admin/users/:id/verify
export const verifyUser =
  asyncHandler(async (req, res) => {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      res.status(404);

      throw new Error(
        'User not found'
      );
    }

    user.isVerified =
      req.body.isVerified !==
      false;

    await user.save();

    await notify(
      user._id,
      user.isVerified
        ? 'Your account has been verified by an admin.'
        : 'Your verification was revoked.',
      'admin'
    );

    res.json({
      _id: user._id,
      isVerified:
        user.isVerified,
    });
  });

// GET /api/admin/requests
export const getAllRequests =
  asyncHandler(async (req, res) => {
    const requests =
      await HelpRequest.find({})
        .populate(
          'createdBy',
          'name email'
        )
        .populate(
          'claimedBy',
          'name'
        )
        .sort({
          createdAt: -1,
        })
        .limit(300);

    res.json(requests);
  });

// DELETE /api/admin/requests/:id
export const removeRequest =
  asyncHandler(async (req, res) => {
    const request =
      await HelpRequest.findByIdAndDelete(
        req.params.id
      );

    if (!request) {
      res.status(404);

      throw new Error(
        'Request not found'
      );
    }

    res.json({
      message:
        'Request removed',
      _id:
        req.params.id,
    });
  });