// Shared option lists used by Sprint 1 request forms and filters.

export const NEED_TYPES = ['food', 'water', 'medicine', 'rescue', 'shelter'];
export const URGENCIES = ['normal', 'high', 'sos'];
export const STATUSES = ['open'];

// A handful of flood-prone Bangladeshi districts with [lng, lat] map centers.
export const DISTRICTS = {
  Dhaka: [90.4125, 23.8103],
  Sylhet: [91.8833, 24.8949],
  Sunamganj: [91.395, 25.0658],
  Feni: [91.3976, 23.0159],
  Chattogram: [91.8123, 22.3569],
  Kurigram: [89.6361, 25.8054],
  Bogura: [89.3711, 24.8465],
  Rangpur: [89.2444, 25.7439],
};

export const DISTRICT_NAMES = Object.keys(DISTRICTS);

export const BD_CENTER = [23.685, 90.3563];

export const NEED_COLORS = {
  food: '#fd7e14',
  water: '#0dcaf0',
  medicine: '#d63384',
  rescue: '#dc3545',
  shelter: '#6610f2',
};
