import express from 'express';

import {
  createShelter,
  getShelters,
  updateOccupancy,
} from '../controllers/shelterController.js';

import {
  protect,
  authorize,
} from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(getShelters)
  .post(
    protect,
    authorize('org_admin', 'admin'),
    createShelter
  );

router.put(
  '/:id/occupancy',
  protect,
  updateOccupancy
);

export default router;