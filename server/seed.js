import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import { connectDB, disconnectDB } from './config/db.js';
import User from './models/User.js';
import HelpRequest from './models/HelpRequest.js';
import Campaign from './models/Campaign.js';
import Donation from './models/Donation.js';
import Shelter from './models/Shelter.js';
import MissingPerson from './models/MissingPerson.js';
import Organization from './models/Organization.js';
import InventoryItem from './models/InventoryItem.js';
import DistributionLog from './models/DistributionLog.js';
import Notification from './models/Notification.js';
import Report from './models/Report.js';
import Rating from './models/Rating.js';

// Coordinates are [lng, lat].
const PLACES = {
  Sylhet: [91.8833, 24.8949],
  Sunamganj: [91.395, 25.0658],
  Dhaka: [90.4125, 23.8103],
  Feni: [91.3976, 23.0159],
  Chattogram: [91.8123, 22.3569],
  Kurigram: [89.6361, 25.8054],
};

const run = async () => {
  await connectDB();

  console.log('🧹 Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    HelpRequest.deleteMany({}),
    Campaign.deleteMany({}),
    Donation.deleteMany({}),
    Shelter.deleteMany({}),
    MissingPerson.deleteMany({}),
    Organization.deleteMany({}),
    InventoryItem.deleteMany({}),
    DistributionLog.deleteMany({}),
    Notification.deleteMany({}),
    Report.deleteMany({}),
    Rating.deleteMany({}),
  ]);

  const hash = await bcrypt.hash('password123', 10);
  const mk = (name, email, role, district, extra = {}) =>
    ({
      name,
      email,
      passwordHash: hash,
      role,
      phone: '01700000000',
      location: { district, upazila: 'Sadar', coords: PLACES[district] },
      ...extra,
    });

  console.log('👤 Creating users...');
  const [admin, citizen1, citizen2, volunteer1, volunteer2, donor1, orgAdmin] = await User.create([
    mk('Admin', 'admin@bachao.org', 'admin', 'Dhaka', { isVerified: true }),
    mk('Karim Uddin', 'karim@example.com', 'citizen', 'Sylhet'),
    mk('Rahima Begum', 'rahima@example.com', 'citizen', 'Sunamganj'),
    mk('Volunteer Hasan', 'hasan@example.com', 'volunteer', 'Sylhet', { isVerified: true, ratingAvg: 4.6, ratingCount: 8 }),
    mk('Volunteer Nadia', 'nadia@example.com', 'volunteer', 'Dhaka', { isVerified: true, ratingAvg: 4.9, ratingCount: 12 }),
    mk('Donor Tareq', 'tareq@example.com', 'donor', 'Dhaka'),
    mk('NGO Manager Lima', 'lima@example.com', 'org_admin', 'Dhaka', { isVerified: true }),
  ]);

  console.log('🏢 Creating organizations + inventory...');
  const org = await Organization.create({
    name: 'Bangladesh Relief Foundation',
    contact: '02-555-0100',
    description: 'Community-driven flood relief across Sylhet division.',
    areasServed: ['Sylhet', 'Sunamganj'],
    isVerified: true,
    owner: orgAdmin._id,
  });
  await User.findByIdAndUpdate(orgAdmin._id, { organization: org._id });
  const org2 = await Organization.create({
    name: 'HopeBridge BD',
    contact: '02-555-0200',
    description: 'New volunteer network — pending verification.',
    areasServed: ['Feni', 'Chattogram'],
    isVerified: false,
    owner: orgAdmin._id,
  });
  await InventoryItem.create([
    { organization: org._id, itemName: 'Rice', quantity: 500, unit: 'kg' },
    { organization: org._id, itemName: 'Water', quantity: 1200, unit: 'bottles' },
    { organization: org._id, itemName: 'Medicine Kit', quantity: 80, unit: 'kits' },
  ]);

  console.log('🆘 Creating help requests...');
  const reqDefs = [
    ['rescue', 'Family stranded on rooftop, water rising fast', 5, 'Sylhet', 'sos', 'open'],
    ['food', 'No dry food for 3 days', 4, 'Sunamganj', 'high', 'open'],
    ['medicine', 'Diabetic patient needs insulin', 1, 'Sylhet', 'high', 'open'],
    ['water', 'Clean drinking water needed', 12, 'Feni', 'normal', 'open'],
    ['shelter', 'House collapsed, need shelter for tonight', 6, 'Kurigram', 'high', 'open'],
    ['food', 'Elderly couple, no food', 2, 'Dhaka', 'normal', 'claimed'],
    ['resource', 'Need a boat to evacuate 10 people in Sylhet', 10, 'Sylhet', 'sos', 'open'],
  ];
  const requests = [];
  for (const [needType, description, peopleAffected, district, urgency, status] of reqDefs) {
    const r = await HelpRequest.create({
      createdBy: (district === 'Sunamganj' ? citizen2 : citizen1)._id,
      needType,
      description,
      peopleAffected,
      location: { district, upazila: 'Sadar', coords: PLACES[district] },
      urgency,
      status,
      claimedBy: status === 'claimed' ? volunteer2._id : undefined,
      isResourceNeed: needType === 'resource',
    });
    requests.push(r);
  }

  // One fully completed request -> rating, to show a closed lifecycle + impact.
  const done = await HelpRequest.create({
    createdBy: citizen1._id,
    needType: 'food',
    description: 'Food packets delivered',
    peopleAffected: 8,
    location: { district: 'Sylhet', upazila: 'Sadar', coords: PLACES.Sylhet },
    urgency: 'normal',
    status: 'closed',
    claimedBy: volunteer1._id,
    confirmedByCitizen: true,
  });
  await Rating.create({
    request: done._id,
    ratedBy: citizen1._id,
    ratedUser: volunteer1._id,
    stars: 5,
    comment: 'Very fast and kind, thank you!',
  });
  await DistributionLog.create({
    actor: volunteer1._id,
    request: done._id,
    itemsGiven: 'Rice',
    quantity: 8,
    peopleHelped: 8,
    area: 'Sylhet',
  });

  console.log('💰 Creating campaigns + donations...');
  const campaign = await Campaign.create({
    title: 'Sylhet Flood Emergency Fund',
    description: 'Food, clean water and medicine for families displaced by the Sylhet floods.',
    organizer: donor1._id,
    goalAmount: 200000,
    raisedAmount: 0,
    type: 'money',
    district: 'Sylhet',
  });
  const d1 = await Donation.create({ campaign: campaign._id, donor: donor1._id, amount: 50000 });
  const d2 = await Donation.create({ campaign: campaign._id, donor: citizen2._id, amount: 15000 });
  campaign.raisedAmount = 65000;
  campaign.distributedAmount = 20000;
  await campaign.save();

  await Campaign.create({
    title: 'Winter Blankets for Kurigram',
    description: 'Goods drive — warm blankets and clothing.',
    organizer: orgAdmin._id,
    goalAmount: 1000,
    type: 'goods',
    district: 'Kurigram',
  });

  console.log('🏠 Creating shelters...');
  await Shelter.create([
    {
      name: 'Sylhet Govt. Primary School Shelter',
      location: { district: 'Sylhet', upazila: 'Sadar', coords: PLACES.Sylhet },
      capacity: 200,
      currentOccupancy: 140,
      facilities: ['water', 'medical', 'food'],
      managedBy: orgAdmin._id,
      contact: '01711111111',
    },
    {
      name: 'Sunamganj Community Center',
      location: { district: 'Sunamganj', upazila: 'Sadar', coords: PLACES.Sunamganj },
      capacity: 120,
      currentOccupancy: 120,
      facilities: ['water', 'food'],
      managedBy: orgAdmin._id,
      contact: '01722222222',
    },
  ]);

  console.log('🔎 Creating missing persons...');
  await MissingPerson.create([
    {
      name: 'Shuvo Mia',
      age: 9,
      lastSeenLocation: { district: 'Sylhet', upazila: 'Sadar' },
      description: 'Wearing a red t-shirt, separated from family during evacuation.',
      contact: '01733333333',
      status: 'missing',
      reportedBy: citizen1._id,
    },
    {
      name: 'Abdul Karim',
      age: 67,
      lastSeenLocation: { district: 'Sunamganj', upazila: 'Sadar' },
      description: 'Elderly, may be disoriented.',
      status: 'found',
      reportedBy: citizen2._id,
    },
  ]);

  console.log('🚩 Creating a report + notifications...');
  await Report.create({
    targetType: 'HelpRequest',
    targetId: requests[0]._id,
    reportedBy: volunteer2._id,
    reason: 'Looks like a possible duplicate of another Sylhet rescue request.',
  });
  await Notification.create([
    { user: volunteer1._id, message: 'New SOS rescue request near you in Sylhet.', type: 'request', link: '/' },
    { user: donor1._id, message: 'Your campaign reached ৳65,000 raised.', type: 'donation', link: '/campaigns' },
  ]);

  // Force a checkpoint so every write is flushed to disk before the
  // self-contained MongoDB shuts down (otherwise late writes can be lost).
  try {
    await mongoose.connection.db.admin().command({ fsync: 1 });
  } catch (err) {
    console.warn('fsync skipped:', err.message);
  }

  const shelterCount = await Shelter.countDocuments();
  const missingCount = await MissingPerson.countDocuments();
  console.log(`\n✅ Seed complete!  (shelters: ${shelterCount}, missing: ${missingCount})`);
  console.log('--------------------------------------------------');
  console.log('Login with any of these (password: password123):');
  console.log('  admin@bachao.org      (admin)');
  console.log('  karim@example.com     (citizen)');
  console.log('  hasan@example.com     (volunteer)');
  console.log('  tareq@example.com     (donor)');
  console.log('  lima@example.com      (org_admin)');
  console.log('--------------------------------------------------');

  await disconnectDB();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
