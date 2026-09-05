import Report from '../models/Report.js';
import HelpRequest from '../models/HelpRequest.js';
import Organization from '../models/Organization.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST /api/reports
// Logged-in users can flag suspicious content.
export const createReport =
  asyncHandler(async (req, res) => {
    const {
      targetType,
      targetId,
      reason,
    } = req.body;

    if (
      ![
        'HelpRequest',
        'Organization',
        'User',
      ].includes(targetType)
    ) {
      res.status(400);

      throw new Error(
        'Invalid report target type'
      );
    }

    if (!targetId || !reason) {
      res.status(400);

      throw new Error(
        'Target and reason are required'
      );
    }

    const report =
      await Report.create({
        targetType,
        targetId,
        reportedBy:
          req.user._id,
        reason,
      });

    res.status(201).json(
      report
    );
  });

// GET /api/reports
// Admin moderation queue.
export const getReports =
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.status) {
      filter.status =
        req.query.status;
    }

    const reports =
      await Report.find(filter)
        .populate(
          'reportedBy',
          'name email'
        )
        .sort({
          status: 1,
          createdAt: -1,
        });

    res.json(reports);
  });

// PUT /api/reports/:id
export const resolveReport =
  asyncHandler(async (req, res) => {
    const { action } =
      req.body;

    const report =
      await Report.findById(
        req.params.id
      );

    if (!report) {
      res.status(404);

      throw new Error(
        'Report not found'
      );
    }

    if (action === 'remove') {
      if (
        report.targetType ===
        'HelpRequest'
      ) {
        await HelpRequest.findByIdAndDelete(
          report.targetId
        );
      }

      if (
        report.targetType ===
        'Organization'
      ) {
        await Organization.findByIdAndDelete(
          report.targetId
        );
      }

      report.status =
        'reviewed';
    } else if (
      action === 'dismiss'
    ) {
      report.status =
        'dismissed';
    } else {
      report.status =
        'reviewed';
    }

    await report.save();

    res.json(report);
  });