import express from 'express';
import {
  createRequest,
  createSOS,
  getRequests,
  getMyRequests,
  getRequestById,
} from '../controllers/helpRequestController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getRequests).post(protect, createRequest);
router.post('/sos', protect, createSOS);
router.get('/mine', protect, getMyRequests);
router.get('/:id', getRequestById);

export default router;
