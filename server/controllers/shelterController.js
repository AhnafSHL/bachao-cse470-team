import Shelter from '../models/Shelter.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @route POST /api/shelters
// Sprint 3: add a shelter to the public directory.
export const createShelter = asyncHandler(async (req, res) => {
  const {
    name,
    location,
    capacity,
    currentOccupancy,
    facilities,
    contact,
  } = req.body;

  if (!name || !location) {
    res.status(400);
    throw new Error('Shelter name and location are required');
  }

  const shelter = await Shelter.create({
    name,
    location,
    capacity: capacity || 0,
    currentOccupancy: currentOccupancy || 0,
    facilities: Array.isArray(facilities) ? facilities : [],
    contact: contact || '',
    managedBy: req.user._id,
  });

  res.status(201).json(shelter);
});

// @route GET /api/shelters
// Sprint 3: public directory with optional district/free-bed filters.
export const getShelters = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.district) {
    filter['location.district'] = new RegExp(
      `^${req.query.district}$`,
      'i'
    );
  }

  let shelters = await Shelter.find(filter)
    .populate('managedBy', 'name')
    .sort({ createdAt: -1 });

  if (req.query.available === 'true') {
    shelters = shelters.filter(
      (shelter) =>
        shelter.capacity - shelter.currentOccupancy > 0
    );
  }

  res.json(shelters);
});

// @route PUT /api/shelters/:id/occupancy
// Sprint 3: manager/admin updates occupancy.
export const updateOccupancy = asyncHandler(async (req, res) => {
  const shelter = await Shelter.findById(req.params.id);

  if (!shelter) {
    res.status(404);
    throw new Error('Shelter not found');
  }

  const isManager =
    String(shelter.managedBy) === String(req.user._id);

  if (!isManager && req.user.role !== 'admin') {
    res.status(403);
    throw new Error(
      'Only the shelter manager or an admin can update occupancy'
    );
  }

  const occupancy = Number(req.body.currentOccupancy);

  if (Number.isNaN(occupancy) || occupancy < 0) {
    res.status(400);
    throw new Error('Occupancy must be a non-negative number');
  }

  shelter.currentOccupancy = Math.min(
    occupancy,
    shelter.capacity
  );

  await shelter.save();

  res.json(shelter);
});