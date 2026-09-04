import MissingPerson from '../models/MissingPerson.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @route POST /api/missing
// Sprint 3: report a missing person.
export const createMissingPerson =
  asyncHandler(async (req, res) => {
    const {
      name,
      age,
      photoUrl,
      lastSeenLocation,
      description,
      contact,
    } = req.body;

    if (!name) {
      res.status(400);

      throw new Error(
        "The missing person's name is required"
      );
    }

    const person =
      await MissingPerson.create({
        name,
        age,
        photoUrl:
          photoUrl || '',

        lastSeenLocation:
          lastSeenLocation || {},

        description:
          description || '',

        contact:
          contact || '',

        reportedBy:
          req.user._id,
      });

    res.status(201).json(
      person
    );
  });

// @route GET /api/missing
// Public missing-person board.
export const getMissingPersons =
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.status) {
      filter.status =
        req.query.status;
    }

    if (req.query.district) {
      filter[
        'lastSeenLocation.district'
      ] = new RegExp(
        `^${req.query.district}$`,
        'i'
      );
    }

    const people =
      await MissingPerson.find(
        filter
      )
        .populate(
          'reportedBy',
          'name phone'
        )
        .sort({
          status: 1,
          createdAt: -1,
        });

    res.json(people);
  });

// @route PUT /api/missing/:id/found
// Reporter/admin resolves a missing-person report.
export const markFound =
  asyncHandler(async (req, res) => {
    const person =
      await MissingPerson.findById(
        req.params.id
      );

    if (!person) {
      res.status(404);

      throw new Error(
        'Record not found'
      );
    }

    const isReporter =
      String(
        person.reportedBy
      ) ===
      String(
        req.user._id
      );

    if (
      !isReporter &&
      req.user.role !== 'admin'
    ) {
      res.status(403);

      throw new Error(
        'Only the reporter or an admin can mark this person found'
      );
    }

    person.status =
      'found';

    await person.save();

    res.json(person);
  });