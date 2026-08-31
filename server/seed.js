import 'dotenv/config';

import bcrypt from 'bcryptjs';

import {
  connectDB,
  disconnectDB,
} from './config/db.js';

import User from './models/User.js';
import HelpRequest from './models/HelpRequest.js';
import DistributionLog from './models/DistributionLog.js';
import Rating from './models/Rating.js';

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

  console.log(
    '\n✅ Sprint 2 seed complete!'
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

  await disconnectDB();
};

run().catch(async (err) => {
  console.error(
    '❌ Seed failed:',
    err
  );

  await disconnectDB();

  process.exit(1);
});