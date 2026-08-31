import express from 'express';
import { getHeatmap } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/heatmap', getHeatmap);

export default router;