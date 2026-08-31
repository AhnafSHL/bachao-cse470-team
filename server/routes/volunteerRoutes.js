import express from 'express';
import {
  claimRequest,
  getMyTasks,
  updateStatus,
  logDistribution,
  getDistributions,
} from '../controllers/volunteerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.put(
  '/requests/:id/claim',
  protect,
  authorize('volunteer', 'admin'),
  claimRequest
);

router.put(
  '/requests/:id/status',
  protect,
  authorize('volunteer', 'admin'),
  updateStatus
);

router.get(
  '/tasks',
  protect,
  authorize('volunteer', 'admin'),
  getMyTasks
);

router
  .route('/distributions')
  .get(protect, getDistributions)
  .post(
    protect,
    authorize('volunteer', 'admin'),
    logDistribution
  );

export default router;