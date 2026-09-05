import HelpRequest from '../models/HelpRequest.js';
import Donation from '../models/Donation.js';
import DistributionLog from '../models/DistributionLog.js';
import Shelter from '../models/Shelter.js';
import { asyncHandler } from '../utils/asyncHandler.js';


export const getImpact =
  asyncHandler(async (req, res) => {
    const [
      totalRequests,
      openRequests,
      served,
      peopleAgg,
      donationAgg,
      byDistrict,
      byNeedType,
      shelters,
    ] = await Promise.all([
      HelpRequest.countDocuments(
        {}
      ),

      HelpRequest.countDocuments({
        status: 'open',
      }),

      HelpRequest.countDocuments({
        status: {
          $in: [
            'fulfilled',
            'closed',
          ],
        },
      }),

      HelpRequest.aggregate([
        {
          $match: {
            status: {
              $in: [
                'fulfilled',
                'closed',
              ],
            },
          },
        },

        {
          $group: {
            _id: null,
            people: {
              $sum:
                '$peopleAffected',
            },
          },
        },
      ]),

      Donation.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: '$amount',
            },
            count: {
              $sum: 1,
            },
          },
        },
      ]),

      HelpRequest.aggregate([
        {
          $group: {
            _id: {
              $ifNull: [
                '$location.district',
                'Unknown',
              ],
            },

            total: {
              $sum: 1,
            },

            served: {
              $sum: {
                $cond: [
                  {
                    $in: [
                      '$status',
                      [
                        'fulfilled',
                        'closed',
                      ],
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            people: {
              $sum:
                '$peopleAffected',
            },
          },
        },

        {
          $sort: {
            total: -1,
          },
        },
      ]),

      HelpRequest.aggregate([
        {
          $group: {
            _id: '$needType',
            count: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            count: -1,
          },
        },
      ]),

      Shelter.aggregate([
        {
          $group: {
            _id: null,

            capacity: {
              $sum: '$capacity',
            },

            occupancy: {
              $sum:
                '$currentOccupancy',
            },

            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    const distributions =
      await DistributionLog.aggregate([
        {
          $group: {
            _id: null,

            count: {
              $sum: 1,
            },

            peopleHelped: {
              $sum:
                '$peopleHelped',
            },
          },
        },
      ]);

    res.json({
      totals: {
        totalRequests,

        openRequests,

        served,

        peopleHelped:
          peopleAgg[0]?.people ||
          0,

        donationsTotal:
          donationAgg[0]?.total ||
          0,

        donationsCount:
          donationAgg[0]?.count ||
          0,

        distributions:
          distributions[0]
            ?.count || 0,

        shelterCapacity:
          shelters[0]?.capacity ||
          0,

        shelterOccupancy:
          shelters[0]
            ?.occupancy || 0,

        shelterCount:
          shelters[0]?.count ||
          0,
      },

      byDistrict:
        byDistrict.map(
          (district) => ({
            district:
              district._id ||
              'Unknown',

            total:
              district.total,

            served:
              district.served,

            people:
              district.people,
          })
        ),

      byNeedType:
        byNeedType.map(
          (need) => ({
            needType:
              need._id,

            count:
              need.count,
          })
        ),
    });
  });

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