# Bachao — Disaster & Flood Relief Coordination Platform

> A full-stack disaster relief coordination platform designed for flood and emergency response in Bangladesh.

**Bachao (বাঁচাও — “save”)** connects affected citizens, volunteers, donors, NGOs and administrators through one coordinated platform for emergency requests, relief distribution, campaigns, shelters, resource management and impact tracking.

This project was developed as a team project for **CSE470 — Software Engineering**.

---

## Project Overview

During disasters, relief information is often fragmented between affected people, volunteers, NGOs and donors.

Bachao provides a centralized system where:

- citizens can request emergency help;
- volunteers can claim and fulfill requests;
- donors can contribute through campaigns;
- shelters and missing-person information can be coordinated;
- NGOs can manage organizations and relief inventory;
- administrators can verify users and moderate the platform;
- everyone can view location-based relief needs and overall impact.

The project follows a **MERN stack** architecture with an **MVC-based Express backend**.

---

## Main Features

### Sprint 1 — Core Requests & Live Map

Implemented by **Mohammad Al Amin** (`ma0082201-max`)

- User authentication foundation
- Post emergency help requests
- One-tap SOS requests
- Live relief map
- Request filtering
- District and urgency filters
- My Requests page
- Request status tracking

### Sprint 2 — Volunteer Relief Lifecycle

Implemented by **Ahnaf Shafique** (`AhnafSHL`)

- Volunteer request claiming
- Volunteer dashboard
- Request lifecycle:
  `open → claimed → fulfilled → closed`
- Relief distribution logging
- Citizen confirmation
- Volunteer ratings
- Unmet-needs heatmap
- Seed persistence improvement

### Sprint 3 — Donations, Shelters & Missing Persons

Implemented by **Tithi Barai** (`tithi1698`)

- Relief campaigns
- Donation system
- Donation ledger
- Transparency tracking
- Campaign-to-request matching
- Shelter directory
- Shelter occupancy management
- Missing-person reporting
- Missing-person status management
- Sprint 3 demonstration data

### Sprint 4 — Organizations, Trust & Analytics

Implemented by **Raiyan Khan** (`raiyan-khan-tech`)

- NGO / organization management
- Organization administrator role
- Organization inventory
- Automatic inventory reduction after distributions
- Notification system
- Activity alerts
- Reports and content moderation
- Admin dashboard
- Organization verification
- Volunteer verification
- Resource coordination board
- Resource-specific requests
- Area-wise impact analytics
- Bangla / English interface
- Final integrated demonstration data

---

## Team

| Member | GitHub | Sprint | Main Responsibility |
|---|---|---|---|
| Mohammad Al Amin | `ma0082201-max` | Sprint 1 | Core requests, SOS, map and request tracking |
| Ahnaf Shafique | `AhnafSHL` | Sprint 2 | Volunteer lifecycle, distributions, rating and heatmap |
| Tithi Barai | `tithi1698` | Sprint 3 | Campaigns, donations, shelters and missing persons |
| Raiyan Khan | `raiyan-khan-tech` | Sprint 4 | Organizations, notifications, moderation and analytics |

Work was divided primarily by **sprint scope**. Shared integration files were modified incrementally as later features were added.

---

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Axios
- Leaflet
- React Leaflet
- Leaflet Heat
- Recharts
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt

### Development

- Git
- GitHub
- VS Code
- npm
- Postman / PowerShell REST testing

---

## Architecture

Bachao follows an MVC-style backend architecture:

```text
React View
    ↓
API Service
    ↓
Express Routes
    ↓
Controllers
    ↓
Mongoose Models
    ↓
MongoDB
