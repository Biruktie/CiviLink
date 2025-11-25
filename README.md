# **CiviLink – Government Service Application**

*A platform for citizens, officers, and administrators to manage national services efficiently.*

---

## 📌 **Overview**

CiviLink is a government service automation system that allows:

### 👤 Citizens

* Apply for **TIN** (Tax Identification Number)
* Apply for **Vital Registration**
* Track application status
* Submit questions & queries to officers

### 🧑‍💼 Officers

* Receive and process applications
* Approve or reject requests
* Respond to citizen queries
* Publish weekly announcements (if assigned)

### 👨‍⚖️ Admins

* Manage officer accounts
* Assign/removal of roles
* View system metrics
* Monitor security issues

---

## 🏗 **Project Architecture**

The system follows a **modular full-stack architecture**:

```
Civilink/
│
├── client/        # React frontend
├── server/        # Node.js backend
├── docs/          # All documentation
└── .github/       # GitHub automation (CI, PR templates)
```

🟦 **Frontend:** React (JavaScript, no TypeScript)
🟩 **Backend:** Node.js (JavaScript)
🗄 **Database:** MongoDB
🧪 **Testing:** Jest (unit), Cypress (E2E)
🚀 **Deployment:** Render (no Docker, no reverse proxy)

---

## 🔧 **Tech Stack**

| Layer           | Technologies                   |
| --------------- | ------------------------------ |
| Frontend        | React, React Router, Axios     |
| Backend         | Node.js, Express.js            |
| Database        | MongoDB                        |
| Validation      | Joi / express-validator        |
| Auth            | JWT-based RBAC                 |
| Testing         | Jest, Supertest, Cypress       |
| Deployment      | Render                         |
| Version Control | Git + GitHub (dev → main flow) |

---

## 📂 **Repository Structure**

```
Civilink/
├── client/                
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/     
│   │   │   ├── citizen/
│   │   │   ├── officer/
│   │   │   └── admin/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── __tests__/
│   └── .env.example
│
├── server/                
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validations/
│   ├── config/
│   ├── helpers/
│   ├── repositories/
│   └── __tests__/
│
├── docs/
│   ├── product/
│   ├── scrum/
│   ├── academic/
│   ├── technical/
│   ├── risks-and-project-plans/
│   └── user-guides/
│
└── .github/
    ├── workflows/
    ├── PULL_REQUEST_TEMPLATE.md
    └── ISSUE_TEMPLATE/
```

---

# 🚀 **Getting Started**

## 1️⃣ Clone the Repository

```sh
git clone https://github.com/ob22a/CiviLink
cd CiviLink
```

## 2️⃣ Install Dependencies

### Client:

```sh
cd client
npm install
```

### Server:

```sh
cd server
npm install
```

---

# 🔐 Environment Variables

### Frontend: `/client/.env.example`

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### Backend: `/server/.env.example`

```
MONGO_URI=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Copy each example file and rename to `.env`.

---

# ▶️ Run Locally

### Start Backend:

```sh
cd server
npm run dev
```

### Start Frontend:

```sh
cd client
npm start
```

---

# 🧪 Testing

### Backend Tests (Jest + Supertest)

```sh
cd server
npm test
```

### End-to-End Tests (Cypress)

```sh
cd client
npm run cypress
```

Every PR must include tests **if applicable**.

---

# 🌀 Git Workflow (Important)

### All work is done in `dev` branch.

✔ Developers create feature branches:

```
feature/<name>
bugfix/<name>
hotfix/<name>
```

✔ Pull requests must target:

```
dev → main only when releasing
```

✔ No one merges their own PR.

---

# 📄 Documentation

All project documents live here:

```
/docs/
```

Contains:

* Product requirements
* SRS
* API documentation
* Architecture
* Testing
* Roadmaps
* Risk analysis
* Scrum artifacts

---

# 🔒 Security

The system follows:

* JWT authentication
* RBAC per role (citizen/officer/admin)
* Input validation on every endpoint
* Request logging
* No storing of sensitive data in logs
* HTTPS enforced by Render

To report a security issue, contact the PM or create a **Security Issue** in GitHub.

---

# 👥 Contributing

Follow the rules in:

```
/docs/guidelines/CONTRIBUTING.md
```

Includes:

* Branch naming rules
* PR requirements
* Commit style
* Testing policy
* Reviewer responsibilities

---

# 🎉 Contributors

(Add your names or leave this dynamic.)

---
