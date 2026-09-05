import express from 'express';

import {
  createReport,
  getReports,
  resolveReport,
} from '../controllers/reportController.js';

import {
  protect,
  authorize,
} from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(
    protect,
    authorize('admin'),
    getReports
  )
  .post(
    protect,
    createReport
  );

router.put(
  '/:id',
  protect,
  authorize('admin'),
  resolveReport
);

export default router;