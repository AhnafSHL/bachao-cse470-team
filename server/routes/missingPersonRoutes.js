import express from 'express';

import {
  createMissingPerson,
  getMissingPersons,
  markFound,
} from '../controllers/missingPersonController.js';

import {
  protect,
} from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(
    getMissingPersons
  )
  .post(
    protect,
    createMissingPerson
  );

router.put(
  '/:id/found',
  protect,
  markFound
);

export default router;