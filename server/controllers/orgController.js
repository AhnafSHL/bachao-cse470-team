import Organization from '../models/Organization.js';
import InventoryItem from '../models/InventoryItem.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST /api/orgs
// Organization admins/admins can register an organization.
// New organizations start unverified.
export const createOrg = asyncHandler(
  async (req, res) => {
    const {
      name,
      contact,
      description,
      areasServed,
    } = req.body;

    if (!name) {
      res.status(400);

      throw new Error(
        'Organization name is required'
      );
    }

    const org =
      await Organization.create({
        name,

        contact:
          contact || '',

        description:
          description || '',

        areasServed:
          Array.isArray(
            areasServed
          )
            ? areasServed
            : String(
                areasServed || ''
              )
                .split(',')
                .map((area) =>
                  area.trim()
                )
                .filter(Boolean),

        owner:
          req.user._id,
      });

    // Connect the organization account
    // with the organization it created.
    await User.findByIdAndUpdate(
      req.user._id,
      {
        organization:
          org._id,
      }
    );

    res.status(201).json(
      org
    );
  }
);

// GET /api/orgs
// Public organization directory.
export const getOrgs = asyncHandler(
  async (req, res) => {
    const filter = {};

    if (
      req.query.verified ===
      'true'
    ) {
      filter.isVerified =
        true;
    }

    const orgs =
      await Organization.find(
        filter
      )
        .populate(
          'owner',
          'name'
        )
        .sort({
          isVerified: -1,
          name: 1,
        });

    res.json(orgs);
  }
);

// GET /api/orgs/:id
export const getOrgById =
  asyncHandler(async (req, res) => {
    const org =
      await Organization.findById(
        req.params.id
      ).populate(
        'owner',
        'name'
      );

    if (!org) {
      res.status(404);

      throw new Error(
        'Organization not found'
      );
    }

    res.json(org);
  });

const ensureOrgAccess = (
  req,
  org
) => {
  const isOwner =
    String(org.owner) ===
    String(req.user._id);

  return (
    isOwner ||
    req.user.role === 'admin'
  );
};

// GET /api/orgs/:id/inventory
// Public inventory visibility.
export const getInventory =
  asyncHandler(async (req, res) => {
    const items =
      await InventoryItem.find({
        organization:
          req.params.id,
      }).sort({
        itemName: 1,
      });

    res.json(items);
  });

// POST /api/orgs/:id/inventory
// Organization owner/admin only.
export const addInventoryItem =
  asyncHandler(async (req, res) => {
    const org =
      await Organization.findById(
        req.params.id
      );

    if (!org) {
      res.status(404);

      throw new Error(
        'Organization not found'
      );
    }

    if (
      !ensureOrgAccess(
        req,
        org
      )
    ) {
      res.status(403);

      throw new Error(
        'Only the organization owner or an admin can manage inventory'
      );
    }

    const {
      itemName,
      quantity,
      unit,
    } = req.body;

    if (!itemName) {
      res.status(400);

      throw new Error(
        'Item name is required'
      );
    }

    const item =
      await InventoryItem.create({
        organization:
          org._id,

        itemName,

        quantity:
          quantity || 0,

        unit:
          unit || 'units',
      });

    res.status(201).json(
      item
    );
  });

// PUT /api/orgs/inventory/:itemId
export const updateInventoryItem =
  asyncHandler(async (req, res) => {
    const item =
      await InventoryItem.findById(
        req.params.itemId
      ).populate(
        'organization'
      );

    if (!item) {
      res.status(404);

      throw new Error(
        'Inventory item not found'
      );
    }

    if (
      !ensureOrgAccess(
        req,
        item.organization
      )
    ) {
      res.status(403);

      throw new Error(
        'Only the organization owner or an admin can manage inventory'
      );
    }

    if (
      req.body.quantity !==
      undefined
    ) {
      item.quantity =
        Math.max(
          0,
          Number(
            req.body.quantity
          )
        );
    }

    if (req.body.unit) {
      item.unit =
        req.body.unit;
    }

    await item.save();

    res.json(item);
  });