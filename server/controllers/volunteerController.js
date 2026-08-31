import HelpRequest from '../models/HelpRequest.js';
import DistributionLog from '../models/DistributionLog.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Feature 6: volunteer claims an open request.
// Lifecycle: open -> claimed.
export const claimRequest = asyncHandler(async (req, res) => {
  const request = await HelpRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (request.status !== 'open') {
    res.status(400);
    throw new Error(`Cannot claim — request is already ${request.status}`);
  }

  request.status = 'claimed';
  request.claimedBy = req.user._id;
  await request.save();

  const populated = await request.populate('claimedBy', 'name phone');
  res.json(populated);
});

// Feature 7: volunteer dashboard task list.
export const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await HelpRequest.find({ claimedBy: req.user._id })
    .populate('createdBy', 'name phone')
    .sort({ updatedAt: -1 });

  res.json(tasks);
});

// Feature 8: volunteer advances request lifecycle.
// claimed -> fulfilled.
export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const request = await HelpRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (String(request.claimedBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Only the volunteer who claimed this request can update it');
  }

  const allowed = {
    claimed: ['fulfilled'],
    fulfilled: ['claimed'],
  };

  if (!allowed[request.status]?.includes(status)) {
    res.status(400);
    throw new Error(`Cannot move from ${request.status} to ${status}`);
  }

  request.status = status;
  await request.save();

  res.json(request);
});

// Feature 9: record relief distribution.
export const logDistribution = asyncHandler(async (req, res) => {
  const { request, itemsGiven, quantity, peopleHelped, area } = req.body;

  if (!itemsGiven) {
    res.status(400);
    throw new Error('Please describe the items given');
  }

  const log = await DistributionLog.create({
    actor: req.user._id,
    request: request || undefined,
    itemsGiven,
    quantity: quantity || 1,
    peopleHelped: peopleHelped || 0,
    area: area || req.user.location?.district || '',
  });

  res.status(201).json(log);
});

// Distribution history.
export const getDistributions = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.mine === 'true') filter.actor = req.user._id;
  if (req.query.request) filter.request = req.query.request;

  const logs = await DistributionLog.find(filter)
    .populate('actor', 'name')
    .populate('request', 'needType location')
    .sort({ createdAt: -1 })
    .limit(200);

  res.json(logs);
});