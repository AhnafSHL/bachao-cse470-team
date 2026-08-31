import express from 'express';

import {
  confirmAndRate,
  getUserRatings,
} from '../controllers/ratingController.js';

import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/',
  protect,
  confirmAndRate
);

router.get(
  '/user/:id',
  getUserRatings
);

export default router;