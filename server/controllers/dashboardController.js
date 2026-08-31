import HelpRequest from '../models/HelpRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Sprint 2 Feature 11:
// Public unmet-needs heatmap.
//
// Only open requests count as unmet needs.
// More urgent requests receive greater heat intensity.
export const getHeatmap = asyncHandler(async (req, res) => {
  const openRequests = await HelpRequest.find({
    status: 'open',
  }).select('location urgency');

  const weightByUrgency = {
    normal: 0.4,
    high: 0.7,
    sos: 1,
  };

  const points = openRequests
    .filter(
      (request) =>
        Array.isArray(request.location?.coords) &&
        request.location.coords.length === 2
    )
    .map((request) => ({
      lat: request.location.coords[1],
      lng: request.location.coords[0],
      weight:
        weightByUrgency[request.urgency] || 0.4,
    }));

  res.json(points);
});