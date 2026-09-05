import express from 'express';

import {
  createOrg,
  getOrgs,
  getOrgById,
  getInventory,
  addInventoryItem,
  updateInventoryItem,
} from '../controllers/orgController.js';

import {
  protect,
  authorize,
} from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(
    getOrgs
  )
  .post(
    protect,
    authorize(
      'org_admin',
      'admin'
    ),
    createOrg
  );

// Keep this before /:id so "inventory"
// is not interpreted as an organization id.
router.put(
  '/inventory/:itemId',
  protect,
  updateInventoryItem
);

router.get(
  '/:id',
  getOrgById
);

router
  .route('/:id/inventory')
  .get(
    getInventory
  )
  .post(
    protect,
    addInventoryItem
  );

export default router;