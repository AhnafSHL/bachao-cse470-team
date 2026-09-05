import express from 'express';
import { getImpact, getHeatmap } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/impact', getImpact);
router.get('/heatmap', getHeatmap);

export default router;
