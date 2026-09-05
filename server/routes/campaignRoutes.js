import express from 'express';

import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  donate,
  getCampaignDonations,
  recordDistribution,
  getMatches,
} from '../controllers/campaignController.js';

import {
  protect,
  authorize,
} from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(getCampaigns)
  .post(
    protect,
    authorize(
      'donor',
      'org_admin',
      'admin'
    ),
    createCampaign
  );

router.get(
  '/:id',
  getCampaignById
);

router.post(
  '/:id/donate',
  protect,
  donate
);

router.get(
  '/:id/donations',
  getCampaignDonations
);

router.put(
  '/:id/distribute',
  protect,
  recordDistribution
);

router.get(
  '/:id/matches',
  getMatches
);

export default router;