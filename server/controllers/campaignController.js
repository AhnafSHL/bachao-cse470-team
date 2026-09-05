import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';
import HelpRequest from '../models/HelpRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notify } from '../utils/notify.js';

// Sprint 3:
// Rough BDT estimate used by the campaign-to-request
// matching feature.
const COST_PER_PERSON = {
  food: 300,
  water: 100,
  medicine: 500,
  rescue: 1000,
  shelter: 800,
};

// Sprint 3 Feature:
// Create a relief fundraising / goods campaign.
export const createCampaign =
  asyncHandler(async (req, res) => {
    const {
      title,
      description,
      goalAmount,
      type,
      district,
    } = req.body;

    if (!title) {
      res.status(400);
      throw new Error(
        'A campaign title is required'
      );
    }

    const campaign =
      await Campaign.create({
        title,

        description:
          description || '',

        organizer:
          req.user._id,

        goalAmount:
          Number(goalAmount) || 0,

        type:
          ['money', 'goods'].includes(type)
            ? type
            : 'money',

        district:
          district || '',
      });

    res.status(201).json(campaign);
  });

// Public campaign directory.
export const getCampaigns =
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.status) {
      filter.status =
        req.query.status;
    }

    const campaigns =
      await Campaign.find(filter)
        .populate(
          'organizer',
          'name'
        )
        .sort({
          createdAt: -1,
        });

    res.json(campaigns);
  });

// Public campaign details.
export const getCampaignById =
  asyncHandler(async (req, res) => {
    const campaign =
      await Campaign.findById(
        req.params.id
      ).populate(
        'organizer',
        'name'
      );

    if (!campaign) {
      res.status(404);
      throw new Error(
        'Campaign not found'
      );
    }

    res.json(campaign);
  });

// Authenticated donation/contribution.
export const donate =
  asyncHandler(async (req, res) => {
    const {
      amount,
      itemDescription,
    } = req.body;

    const campaign =
      await Campaign.findById(
        req.params.id
      );

    if (!campaign) {
      res.status(404);
      throw new Error(
        'Campaign not found'
      );
    }

    if (
      campaign.status !== 'active'
    ) {
      res.status(400);
      throw new Error(
        'This campaign is closed'
      );
    }

    const numAmount =
      Number(amount) || 0;

    if (
      campaign.type === 'money' &&
      numAmount <= 0
    ) {
      res.status(400);
      throw new Error(
        'Donation amount must be greater than zero'
      );
    }

    if (
      campaign.type === 'goods' &&
      !itemDescription?.trim()
    ) {
      res.status(400);
      throw new Error(
        'Please describe the donated goods'
      );
    }

    const donation =
      await Donation.create({
        campaign:
          campaign._id,

        donor:
          req.user._id,

        amount:
          numAmount,

        itemDescription:
          itemDescription || '',
      });

    campaign.raisedAmount +=
      numAmount;

    await campaign.save();

    await notify(
      campaign.organizer,
      `${req.user.name} donated ${
        numAmount
          ? '৳' + numAmount
          : itemDescription
      } to "${campaign.title}".`,
      'donation',
      '/campaigns'
    );

    res.status(201).json({
      donation,
      campaign,
    });
  });

// Transparency ledger.
export const getCampaignDonations =
  asyncHandler(async (req, res) => {
    const donations =
      await Donation.find({
        campaign:
          req.params.id,
      })
        .populate(
          'donor',
          'name'
        )
        .sort({
          createdAt: -1,
        });

    res.json(donations);
  });

// Organizer/admin records how much money
// has actually been distributed.
export const recordDistribution =
  asyncHandler(async (req, res) => {
    const campaign =
      await Campaign.findById(
        req.params.id
      );

    if (!campaign) {
      res.status(404);
      throw new Error(
        'Campaign not found'
      );
    }

    const isOrganizer =
      String(
        campaign.organizer
      ) ===
      String(
        req.user._id
      );

    if (
      !isOrganizer &&
      req.user.role !== 'admin'
    ) {
      res.status(403);

      throw new Error(
        'Only the organizer or an admin can record distributions'
      );
    }

    const amount =
      Number(
        req.body.amount
      ) || 0;

    if (amount <= 0) {
      res.status(400);

      throw new Error(
        'Distribution amount must be greater than zero'
      );
    }

    if (
      campaign.distributedAmount +
        amount >
      campaign.raisedAmount
    ) {
      res.status(400);

      throw new Error(
        'Cannot distribute more than has been raised'
      );
    }

    campaign.distributedAmount +=
      amount;

    await campaign.save();

    res.json(campaign);
  });

// Sprint 3:
// Match a campaign's remaining funds against
// open relief requests in its target district.
export const getMatches =
  asyncHandler(async (req, res) => {
    const campaign =
      await Campaign.findById(
        req.params.id
      );

    if (!campaign) {
      res.status(404);

      throw new Error(
        'Campaign not found'
      );
    }

    const remaining =
      Math.max(
        0,
        campaign.raisedAmount -
          campaign.distributedAmount
      );

    const filter = {
      status: 'open',
    };

    if (campaign.district) {
      filter[
        'location.district'
      ] = new RegExp(
        `^${campaign.district}$`,
        'i'
      );
    }

    const openRequests =
      await HelpRequest.find(
        filter
      )
        .populate(
          'createdBy',
          'name'
        )
        .sort({
          urgency: -1,
          createdAt: 1,
        });

    let budget = remaining;

    const matches =
      openRequests.map(
        (request) => {
          const estimatedCost =
            (COST_PER_PERSON[
              request.needType
            ] || 500) *
            (request.peopleAffected ||
              1);

          const coverable =
            budget >=
            estimatedCost;

          if (coverable) {
            budget -=
              estimatedCost;
          }

          return {
            request,
            estimatedCost,
            coverable,
          };
        }
      );

    res.json({
      remaining,
      matches,
    });
  });