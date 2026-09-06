<div align="center">

# 🆘 Bachao

### Disaster & Flood Relief Coordination Platform

**A full-stack MERN platform for coordinating citizens, volunteers, donors, NGOs and administrators during disaster and flood relief operations in Bangladesh.**

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express.js-black?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Course](https://img.shields.io/badge/Course-CSE470-blue)

### 📘 [Open the Complete Software Requirements Specification](docs/Bachao_SRS.pdf)

**The SRS contains the complete requirements, use cases and screenshots for all four development sprints.**

</div>

---

# 🌊 About Bachao

**Bachao (বাঁচাও)** is a disaster and flood relief coordination platform developed as a team project for **CSE470 — Software Engineering**.

The platform brings affected citizens, volunteers, donors, NGOs and administrators into one coordinated system.

Citizens can request emergency assistance, volunteers can respond and complete relief tasks, donors can support relief campaigns, organizations can manage resources, and administrators can verify and moderate platform activity.

Bachao was built using the **MERN stack** and follows an **MVC-style backend architecture with REST APIs**.

---

# ✨ Main Features

- 🆘 Emergency help requests
- 🚨 One-tap SOS
- 🗺️ Live disaster relief map
- 🔍 Request filtering
- 🔥 Unmet-needs heatmap
- 🙋 Volunteer request claiming
- 🔄 Full request lifecycle
- 📦 Relief distribution logging
- ⭐ Citizen confirmation and volunteer rating
- 💰 Relief campaigns
- 💳 Donation tracking
- 📊 Campaign transparency
- 🎯 Needs-to-donations matching
- 🏠 Shelter directory
- 🛏️ Shelter occupancy management
- 🔎 Missing Persons Board
- 🏢 NGO / organization directory
- 📦 Organization inventory
- 🔔 Notifications
- 🚩 Reporting and moderation
- ✅ Admin verification
- 🛟 Resource coordination board
- 📈 Area-wise impact analytics
- 🌐 English / বাংলা user interface

---

# 🧩 Sprint Development

Bachao was implemented in four major development sprints.

## Sprint 1 — Core Requests & Live Map

**Developer:** [Mohammad Al Amin](https://github.com/ma0082201-max)

### Main Work

- Authentication foundation
- Help request posting
- One-tap SOS
- Live map
- Request filters
- District filtering
- Urgency filtering
- My Requests
- Request status display

**Screenshots:** See **SRS pages 13–15**.

---

## Sprint 2 — Volunteer Relief Lifecycle

**Developer:** [Ahnaf Shafique](https://github.com/AhnafSHL)

### Main Work

- Volunteer dashboard
- Claim request workflow
- Request lifecycle:

```text
open → claimed → fulfilled → closed
```

- Distribution logging
- Distribution history
- Citizen confirmation
- Five-star volunteer rating
- Unmet-needs heatmap
- Seed persistence improvement

**Screenshots:** See **SRS pages 16–19**.

---

## Sprint 3 — Campaigns, Shelters & Missing Persons

**Developer:** [Tithi Barai](https://github.com/tithi1698)

### Main Work

- Relief campaigns
- Donation system
- Donation ledger
- Campaign transparency tracker
- Needs-to-donations matching
- Shelter directory
- Shelter location visualization
- Shelter occupancy management
- Missing Persons Board
- Mark-person-as-found workflow
- Sprint 3 demonstration data

**Screenshots:** See **SRS pages 20–23**.

---

## Sprint 4 — Organizations, Trust & Analytics

**Developer:** [Raiyan Khan](https://github.com/raiyan-khan-tech)

### Main Work

- NGO / organization directory
- Organization administrator role
- Organization inventory
- Automatic inventory decrement
- Notifications
- Activity alerts
- User reports
- Admin moderation
- Organization verification
- Volunteer verification
- Admin dashboard
- Resource Board
- Resource-specific requests
- Impact analytics
- English / বাংলা interface
- Final integrated demonstration data

**Screenshots:** See **SRS pages 24–29**.

---

# 👥 Development Team

| Student ID | Member | GitHub | Sprint |
|---|---|---|---|
| 22201786 | Mohammad Al Amin | [@ma0082201-max](https://github.com/ma0082201-max) | Sprint 1 |
| 22201796 | Ahnaf Shafique | [@AhnafSHL](https://github.com/AhnafSHL) | Sprint 2 |
| 22201224 | Tithi Barai | [@tithi1698](https://github.com/tithi1698) | Sprint 3 |
| 22201361 | Raiyan Khan | [@raiyan-khan-tech](https://github.com/raiyan-khan-tech) | Sprint 4 |

> Development responsibility was divided primarily by sprint scope. Shared integration files were updated incrementally as later features were introduced.

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- React Router
- Axios
- Leaflet
- React Leaflet
- Leaflet Heat
- Recharts
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt

## Development Tools

- Git
- GitHub
- VS Code
- npm
- REST API testing
- PowerShell

---

# 🏗️ System Architecture

Bachao follows an MVC-style backend architecture.

```text
┌────────────────────────┐
│     React Frontend     │
│        Views           │
└───────────┬────────────┘
            │
            │ HTTP / JSON
            ▼
┌────────────────────────┐
│     Express Routes     │
└───────────┬────────────┘
            ▼
┌────────────────────────┐
│      Controllers       │
│     Business Logic     │
└───────────┬────────────┘
            ▼
┌────────────────────────┐
│     Mongoose Models    │
└───────────┬────────────┘
            ▼
┌────────────────────────┐
│        MongoDB         │
└────────────────────────┘
```

---

# 📂 Project Structure

```text
bachao-cse470-team/
│
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── seed.js
│   └── server.js
│
├── docs/
│   └── Bachao_SRS.pdf
│
├── README.md
└── package.json
```

---

# 🚀 Run Bachao on Your Computer

## Prerequisites

Install:

- Git
- Node.js 18+
- npm

A separate MongoDB installation is not required for the default local-development setup.

When an external `MONGODB_URI` is not configured, Bachao can use its self-contained MongoDB environment.

Local database data is stored under:

```text
server/.mongo-data/
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/AhnafSHL/bachao-cse470-team.git
cd bachao-cse470-team
```

---

## 2. Install Dependencies

Root:

```bash
npm install
```

Backend:

```bash
npm install --prefix server
```

Frontend:

```bash
npm install --prefix client
```

---

## 3. Configure Environment Variables

Create:

```text
server/.env
```

Example:

```env
JWT_SECRET=replace_with_your_private_local_development_secret
```

> Never commit real environment secrets to GitHub.

If no external `MONGODB_URI` is configured, the project uses its self-contained local MongoDB setup.

---

## 4. Seed Demo Data

Run:

```bash
npm run seed
```

This creates demonstration users and application data for testing all major features.

---

# 🔐 Demo Accounts

All seeded demo accounts use:

```text
password123
```

| Role | Email |
|---|---|
| Administrator | `admin@bachao.org` |
| Citizen | `karim@example.com` |
| Volunteer | `hasan@example.com` |
| Donor | `tareq@example.com` |
| Organization Admin | `lima@example.com` |

> These accounts are intended only for local demonstration and testing.

---

# ▶️ Start the Application

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5000
```

Open the frontend address in your browser.

---

# 🧪 Verify the Frontend Build

Run:

```bash
npm run build --prefix client
```

A successful build confirms that the frontend compiles correctly.

---

# 🔌 Major REST API Modules

```text
/api/auth
/api/requests
/api/volunteer
/api/campaigns
/api/shelters
/api/missing
/api/orgs
/api/notifications
/api/reports
/api/admin
/api/dashboard
```

---

# 📘 Project Documentation

## Software Requirements Specification

The complete project SRS is available here:

### 👉 [Open Bachao Software Requirements Specification](docs/Bachao_SRS.pdf)

The document contains:

- project purpose and scope;
- user classes and roles;
- system features;
- functional requirements;
- non-functional requirements;
- core entities;
- use cases;
- validation rules;
- future enhancements;
- complete screenshots for Sprint 1;
- complete screenshots for Sprint 2;
- complete screenshots for Sprint 3;
- complete screenshots for Sprint 4.

### Screenshot Index

| Sprint | SRS Pages | Main Screenshots |
|---|---:|---|
| Sprint 1 | 13–15 | Post Request, SOS, Live Map, Filters, My Requests |
| Sprint 2 | 16–19 | Heatmap, Volunteer Dashboard, Claim, Distribution, Rating |
| Sprint 3 | 20–23 | Campaigns, Donations, Shelters, Missing Persons |
| Sprint 4 | 24–29 | Organizations, Inventory, Notifications, Resources, Admin, Impact |

---

# 🔄 Git Development Workflow

The project was developed using individual sprint branches.

```text
main
│
├── sprint1-alamin
├── sprint2-ahnaf
├── fix/seed-persistence
├── sprint3-tithi
└── sprint4-raiyan
```

Each sprint was integrated into `main` using pull requests and normal merge commits so that development history remained visible.

---

# 📚 Academic Context

**Course:** CSE470 — Software Engineering

The project demonstrates:

- Software Requirements Specification
- sprint-based development
- collaborative Git workflow
- GitHub pull requests
- MVC architecture
- REST APIs
- authentication
- role-based authorization
- MongoDB data modeling
- frontend/backend integration
- testing and validation

---

# 🔒 Security Notes

- Passwords are hashed before storage.
- JWT authentication protects private endpoints.
- Role-based authorization protects privileged operations.
- `.env` must never be committed.
- Demo passwords are intended only for local testing.
- Production environments should use secure secrets and production database infrastructure.

---

<div align="center">

## 📘 [View the Full Bachao SRS](docs/Bachao_SRS.pdf)

### Bachao — Coordinating relief when every minute matters.

**CSE470 — Software Engineering**

</div>
