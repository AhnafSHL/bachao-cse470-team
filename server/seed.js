import 'dotenv/config';

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import {
  connectDB,
  disconnectDB,
} from './config/db.js';

import User from './models/User.js';
import HelpRequest from './models/HelpRequest.js';
import DistributionLog from './models/DistributionLog.js';
import Rating from './models/Rating.js';
import Campaign from './models/Campaign.js';
import Donation from './models/Donation.js';
import Shelter from './models/Shelter.js';
import MissingPerson from './models/MissingPerson.js';

const PLACES = {
  Sylhet: [
    91.8833,
    24.8949,
  ],

  Sunamganj: [
    91.395,
    25.0658,
  ],

  Dhaka: [
    90.4125,
    23.8103,
  ],

  Feni: [
    91.3976,
    23.0159,
  ],
};

const run = async () => {
  await connectDB();

  console.log(
    '🧹 Clearing Sprint 2 demo data...'
  );

  await Promise.all([
    Rating.deleteMany({}),
    DistributionLog.deleteMany({}),
    Donation.deleteMany({}),
    Campaign.deleteMany({}),
    Shelter.deleteMany({}),
    MissingPerson.deleteMany({}),
    HelpRequest.deleteMany({}),
    User.deleteMany({}),
  ]);

  const hash =
    await bcrypt.hash(
      'password123',
      10
    );

  const mk = (
    name,
    email,
    role,
    district
  ) => ({
    name,
    email,
    passwordHash: hash,
    role,

    phone:
      '01700000000',

    location: {
      district,
      upazila: 'Sadar',
      coords:
        PLACES[district],
    },
  });

  console.log(
    '👤 Creating users...'
  );

  const [
    admin,
    citizen1,
    citizen2,
    volunteer1,
    donor1,
  ] = await User.create([
    mk(
      'Admin',
      'admin@bachao.org',
      'admin',
      'Dhaka'
    ),

    mk(
      'Karim Uddin',
      'karim@example.com',
      'citizen',
      'Sylhet'
    ),

    mk(
      'Rahima Begum',
      'rahima@example.com',
      'citizen',
      'Sunamganj'
    ),

    mk(
      'Volunteer Hasan',
      'hasan@example.com',
      'volunteer',
      'Sylhet'
    ),

    mk(
      'Donor Tareq',
      'tareq@example.com',
      'donor',
      'Dhaka'
    ),
  ]);

  console.log(
    '🆘 Creating Sprint 2 help requests...'
  );

  await HelpRequest.create([
    {
      createdBy:
        citizen1._id,

      needType:
        'food',

      description:
        'Food needed for families affected by flood water.',

      peopleAffected:
        12,

      location: {
        district:
          'Sylhet',

        upazila:
          'Sadar',

        coords:
          PLACES.Sylhet,
      },

      urgency:
        'high',
    },

    {
      createdBy:
        citizen2._id,

      needType:
        'water',

      description:
        'Safe drinking water is urgently needed.',

      peopleAffected:
        8,

      location: {
        district:
          'Sunamganj',

        upazila:
          'Sadar',

        coords:
          PLACES.Sunamganj,
      },

      urgency:
        'normal',
    },

    {
      createdBy:
        citizen1._id,

      needType:
        'rescue',

      description:
        'SOS — people are trapped near rising water.',

      peopleAffected:
        4,

      location: {
        district:
          'Feni',

        upazila:
          'Sadar',

        coords:
          PLACES.Feni,
      },

      urgency:
        'sos',
    },
  ]);

  /*
   * Important for mongodb-memory-server with a persistent dbPath:
   *
   * The seed command starts its own MongoDB process and shuts it down
   * immediately after inserting demo data. Force MongoDB to flush the
   * completed writes to server/.mongo-data before shutting down.
   *
   * Without this checkpoint, a following `npm run dev` can occasionally
   * reopen stale data, causing the seeded demo password to appear invalid.
   */
  try {
    await mongoose.connection.db.admin().command({
      fsync: 1,
    });

    console.log(
      '💾 Seed data flushed to disk.'
    );
  } catch (err) {
    console.warn(
      '⚠️ MongoDB flush skipped:',
      err.message
    );
  }

  console.log(
    'Creating Sprint 3 campaigns and donations...'
  );

  const campaign =
    await Campaign.create({
      title:
        'Sylhet Flood Emergency Fund',

      description:
        'Food, clean water and medicine for families affected by the Sylhet floods.',

      organizer:
        donor1._id,

      goalAmount:
        200000,

      raisedAmount:
        65000,

      distributedAmount:
        20000,

      type:
        'money',

      district:
        'Sylhet',
    });

  await Donation.create([
    {
      campaign:
        campaign._id,

      donor:
        donor1._id,

      amount:
        50000,
    },

    {
      campaign:
        campaign._id,

      donor:
        citizen2._id,

      amount:
        15000,
    },
  ]);

  await Campaign.create({
    title:
      'Winter Blankets for Sunamganj',

    description:
      'A goods campaign for blankets and warm clothing.',

    organizer:
      donor1._id,

    goalAmount:
      1000,

    type:
      'goods',

    district:
      'Sunamganj',
  });

  console.log(
    'Creating Sprint 3 shelters...'
  );

  await Shelter.create([
    {
      name:
        'Sylhet Govt. Primary School Shelter',

      location: {
        district:
          'Sylhet',

        upazila:
          'Sadar',

        coords:
          PLACES.Sylhet,
      },

      capacity:
        200,

      currentOccupancy:
        140,

      facilities: [
        'water',
        'medical',
        'food',
      ],

      managedBy:
        volunteer1._id,

      contact:
        '01711111111',
    },

    {
      name:
        'Sunamganj Community Center',

      location: {
        district:
          'Sunamganj',

        upazila:
          'Sadar',

        coords:
          PLACES.Sunamganj,
      },

      capacity:
        120,

      currentOccupancy:
        120,

      facilities: [
        'water',
        'food',
      ],

      managedBy:
        volunteer1._id,

      contact:
        '01722222222',
    },
  ]);

  console.log(
    'Creating Sprint 3 missing-person records...'
  );

  await MissingPerson.create([
    {
      name:
        'Shuvo Mia',

      age:
        9,

      lastSeenLocation: {
        district:
          'Sylhet',

        upazila:
          'Sadar',
      },

      description:
        'Wearing a red t-shirt, separated from family during evacuation.',

      contact:
        '01733333333',

      status:
        'missing',

      reportedBy:
        citizen1._id,
    },

    {
      name:
        'Abdul Karim',

      age:
        67,

      lastSeenLocation: {
        district:
          'Sunamganj',

        upazila:
          'Sadar',
      },

      description:
        'Elderly person who was separated from family during evacuation.',

      contact:
        '01744444444',

      status:
        'found',

      reportedBy:
        citizen2._id,
    },
  ]);

  const [
    campaignCount,
    donationCount,
    shelterCount,
    missingCount,
  ] = await Promise.all([
    Campaign.countDocuments(),
    Donation.countDocuments(),
    Shelter.countDocuments(),
    MissingPerson.countDocuments(),
  ]);

  console.log(
  `Sprint 3 demo data: ${campaignCount} campaigns, ${donationCount} donations, ${shelterCount} shelters, ${missingCount} missing-person records`
  );


  console.log(
    '\n✅ Sprint 3 seed complete!'
  );

  console.log(
    'Login password for all demo users: password123'
  );

  console.log(
    '  admin@bachao.org'
  );

  console.log(
    '  karim@example.com'
  );

  console.log(
    '  hasan@example.com'
  );

  console.log(
  '  tareq@example.com'
  );

  await disconnectDB();

  process.exit(0);
};

run().catch(async (err) => {
  console.error(
    '❌ Seed failed:',
    err
  );

  try {
    await disconnectDB();
  } catch {
    // Ignore cleanup errors while handling the original seed failure.
  }

  process.exit(1);
});