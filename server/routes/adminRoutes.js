import express from 'express';

import {
  getOrgsForReview,
  verifyOrg,
  getUsers,
  verifyUser,
  getAllRequests,
  removeRequest,
} from '../controllers/adminController.js';

import {
  protect,
  authorize,
} from '../middleware/auth.js';

const router = express.Router();

router.use(
  protect,
  authorize('admin')
);

router.get(
  '/orgs',
  getOrgsForReview
);

router.put(
  '/orgs/:id/verify',
  verifyOrg
);

router.get(
  '/users',
  getUsers
);

router.put(
  '/users/:id/verify',
  verifyUser
);

router.get(
  '/requests',
  getAllRequests
);

router.delete(
  '/requests/:id',
  removeRequest
);

export default router;