import HelpRequest from '../models/HelpRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const NEED_TYPES = ['food', 'water', 'medicine', 'rescue', 'shelter'];

// Feature 1: post a help request.
export const createRequest = asyncHandler(async (req, res) => {
  const { needType, description, peopleAffected, location, urgency } = req.body;

  if (!NEED_TYPES.includes(needType)) {
    res.status(400);
    throw new Error('A valid need type is required');
  }
  if (!location || !Array.isArray(location.coords) || location.coords.length !== 2) {
    res.status(400);
    throw new Error('Please pin a location on the map');
  }

  const request = await HelpRequest.create({
    createdBy: req.user._id,
    needType,
    description: description || '',
    peopleAffected: peopleAffected || 1,
    location,
    urgency: ['normal', 'high', 'sos'].includes(urgency) ? urgency : 'normal',
  });

  res.status(201).json(request);
});

// Feature 2: one-tap SOS.
export const createSOS = asyncHandler(async (req, res) => {
  const { location, needType, description } = req.body;

  if (!location || !Array.isArray(location.coords) || location.coords.length !== 2) {
    res.status(400);
    throw new Error('Location is required for an SOS');
  }

  const request = await HelpRequest.create({
    createdBy: req.user._id,
    needType: NEED_TYPES.includes(needType) ? needType : 'rescue',
    description: description || 'SOS — urgent help needed',
    peopleAffected: req.body.peopleAffected || 1,
    location,
    urgency: 'sos',
  });

  res.status(201).json(request);
});

// Features 3 & 4: live requests for the map with filters.
export const getRequests = asyncHandler(async (req, res) => {
  const { district, needType, urgency } = req.query;
  const filter = { status: 'open' };

  if (district) filter['location.district'] = new RegExp(`^${district}$`, 'i');
  if (needType) filter.needType = needType;
  if (urgency) filter.urgency = urgency;

  const requests = await HelpRequest.find(filter)
    .populate('createdBy', 'name phone')
    .sort({ urgency: -1, createdAt: -1 });

  res.json(requests);
});

// Feature 5: track your own requests.
export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await HelpRequest.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 });

  res.json(requests);
});

// Public request detail.
export const getRequestById = asyncHandler(async (req, res) => {
  const request = await HelpRequest.findById(req.params.id)
    .populate('createdBy', 'name phone');

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  res.json(request);
});
