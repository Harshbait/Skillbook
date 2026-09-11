<div align="center">

# 🛠️ SkillBook

### A full-stack MERN service marketplace connecting customers with skilled providers

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](#)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](#)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](#)

**Browse services · Book providers · Chat in real-time · Leave reviews**

</div>

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Booking Flow](#-booking-flow)
- [Data Models](#️-data-models)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Frontend Routes](#-frontend-routes)
- [Roadmap](#️-roadmap)
- [License](#-license)

---

## 🌟 Overview

**SkillBook** is a production-ready MERN-stack marketplace where customers discover and book freelance services, providers manage their offerings and incoming bookings, and an admin panel governs provider approvals — all tied together with **real-time in-booking chat** powered by Socket.io.

---

## ✨ Features

### ✅ Implemented

- **JWT Authentication & Role-Based Access Control**
  - Secure register/login with hashed passwords (`bcryptjs`)
  - Three roles: `customer`, `provider`, `admin`
  - Protected routes on both frontend and backend

- **Service Marketplace**
  - Browse all services publicly
  - Full CRUD for providers (create, edit, delete own services)
  - Service detail pages with booking action

- **Booking System**
  - Customers book services; status tracked through lifecycle
  - `pending → accepted → completed` / `rejected` / `cancelled`
  - Provider cannot book their own service
  - Separate customer & provider booking dashboards

- **Real-Time Chat** *(Socket.io)*
  - Per-booking private chat rooms
  - JWT-authenticated socket connections
  - Messages persisted to MongoDB

- **Reviews & Ratings**
  - Customers review providers after booking completion
  - Ratings visible on service detail pages

- **Provider Onboarding**
  - Any customer can apply to become a provider
  - Admin reviews and approves/rejects applications

- **Admin Dashboard**
  - Manage provider applications
  - Platform-wide oversight

- **Frontend Excellence**
  - Smooth scroll with `locomotive-scroll`
  - Form validation with `react-hook-form` + `zod`
  - Charts & analytics via `recharts`
  - Fully responsive with Tailwind CSS v4

---

## 🧱 Tech Stack

| Layer          | Technology                                           |
| -------------- | ----------------------------------------------------- |
| **Frontend**   | React 19, Vite, Tailwind CSS v4, React Router v7     |
| **Backend**    | Node.js, Express 5                                   |
| **Database**   | MongoDB with Mongoose ODM                            |
| **Auth**       | JWT (JSON Web Tokens), bcryptjs                      |
| **Real-Time**  | Socket.io (WebSockets)                               |
| **Forms**      | react-hook-form + Zod                                |
| **Charts**     | Recharts                                             |
| **HTTP**       | Axios                                                |
| **Scroll**     | Locomotive Scroll                                    |
| **Icons**      | Lucide React                                         |
| **Validation** | express-validator                                    |
| **Dev Tools**  | Nodemon, ESLint                                      |

---

## 📁 Project Structure

```text
SkillBook/
├── backend/
│   ├── server.js                  # HTTP server + Socket.io setup
│   ├── app.js                     # Express app, middleware, routes
│   └── src/
│       ├── config/
│       │   └── db.js              # MongoDB connection
│       ├── models/
│       │   ├── User.js
│       │   ├── Service.js
│       │   ├── Booking.js
│       │   ├── Review.js
│       │   ├── Message.js
│       │   └── ProviderProfile.js
│       ├── controllers/
│       │   ├── userController.js
│       │   ├── serviceController.js
│       │   ├── bookingController.js
│       │   ├── reviewController.js
│       │   ├── chatController.js
│       │   ├── providerController.js
│       │   └── adminController.js
│       ├── routes/
│       │   ├── userRoutes.js
│       │   ├── serviceRoutes.js
│       │   ├── bookingRoutes.js
│       │   ├── reviewRoutes.js
│       │   ├── chatRoutes.js
│       │   ├── providerRoutes.js
│       │   └── adminRoutes.js
│       ├── middleware/
│       │   ├── authMiddleware.js  # protect() — verifies JWT
│       │   └── roleMiddleware.js  # authorizeRoles() — restricts by role
│       └── validators/
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx                # Routes & layout wrapper
        ├── main.jsx
        ├── index.css
        ├── pages/
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Services.jsx
        │   ├── ServiceDetails.jsx
        │   ├── Dashboard.jsx          # Customer dashboard
        │   ├── ProviderDashboard.jsx
        │   ├── AdminDashboard.jsx
        │   ├── ProviderApply.jsx
        │   ├── AddService.jsx
        │   ├── MyServices.jsx
        │   └── EditService.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── BookingCard.jsx
        │   ├── ServiceCard.jsx
        │   ├── ChatModal.jsx          # Real-time chat UI
        │   ├── ReviewModal.jsx
        │   ├── StatusBadge.jsx
        │   ├── StatCard.jsx
        │   ├── ConfirmDialog.jsx
        │   ├── EmptyState.jsx
        │   ├── Loading.jsx
        │   └── SmoothScroll.jsx
        ├── context/                   # React context providers
        ├── hooks/                     # Custom React hooks
        ├── services/                  # Axios API service layer
        └── utils/                    # Helper utilities
```

---

## 👥 User Roles

### 🧑 Customer
- Browse all services publicly
- Book any service (cannot book own services)
- View booking history & live status updates
- Chat with provider per accepted booking
- Review providers after booking completion
- Apply to become a provider

### 🔧 Provider
- Create, edit, and delete own services
- View incoming booking requests
- Accept or reject bookings
- Mark bookings as completed
- Chat with customers per booking

### 🛡️ Admin
- View all provider applications
- Approve or reject provider applications
- Platform-wide management dashboard

---

## 🔄 Booking Flow

```text
Customer browses services
         │
         ▼
  "Book Now" on service page
         │
         ▼
  Booking created ──────► status: pending
         │
         ▼
  Provider sees request
         │
     ┌───┴───┐
     ▼       ▼
 Accepted  Rejected
     │
     ▼
 status: accepted
 (Real-time chat unlocked 💬)
     │
     ▼
 Provider marks complete
     │
     ▼
 status: completed
     │
     ▼
 Customer leaves review ⭐
```

---

## 🗃️ Data Models

### User

| Field      | Type   | Notes                               |
| ---------- | ------ | ----------------------------------- |
| `name`     | String | Full name                           |
| `email`    | String | Unique                              |
| `password` | String | Hashed with bcryptjs                |
| `role`     | String | `customer` \| `provider` \| `admin` |

### Service

| Field         | Type     | Notes                     |
| ------------- | -------- | ------------------------- |
| `title`       | String   | Service name              |
| `description` | String   | Detailed description      |
| `price`       | Number   | Service price             |
| `category`    | String   | Service category          |
| `provider`    | ObjectId | Reference to `User`       |

### Booking

| Field        | Type     | Notes                                                                        |
| ------------ | -------- | ---------------------------------------------------------------------------- |
| `service`    | ObjectId | Reference to `Service`                                                       |
| `customer`   | ObjectId | Reference to `User` — resolved from JWT (never trusted from client)          |
| `provider`   | ObjectId | Denormalized from `service.provider` for fast queries                        |
| `status`     | String   | `pending` \| `accepted` \| `rejected` \| `completed` \| `cancelled`          |
| `message`    | String   | Optional note from customer                                                  |
| `timestamps` | Date     | `createdAt`, `updatedAt`                                                     |

> **Why store `provider` directly on Booking?**
> Denormalizing avoids a join when querying *"all bookings for this provider"* — making the provider dashboard fast without extra population.

### Message

| Field      | Type     | Notes                    |
| ---------- | -------- | ------------------------ |
| `booking`  | ObjectId | Reference to `Booking`   |
| `sender`   | ObjectId | Reference to `User`      |
| `receiver` | ObjectId | Reference to `User`      |
| `message`  | String   | Chat message content     |

### Review

| Field      | Type     | Notes                    |
| ---------- | -------- | ------------------------ |
| `service`  | ObjectId | Reference to `Service`   |
| `booking`  | ObjectId | Reference to `Booking`   |
| `customer` | ObjectId | Reference to `User`      |
| `rating`   | Number   | 1–5 star rating          |
| `comment`  | String   | Written review           |

---

## 🔐 API Reference

### Authentication (`/api/users`)

| Method | Endpoint    | Access  | Description               |
| ------ | ----------- | ------- | ------------------------- |
| POST   | `/register` | Public  | Register a new user       |
| POST   | `/login`    | Public  | Login, returns JWT        |
| GET    | `/profile`  | Private | Get current user profile  |

### Services (`/api/services`)

| Method | Endpoint | Access        | Description           |
| ------ | -------- | ------------- | --------------------- |
| GET    | `/`      | Public        | List all services     |
| GET    | `/:id`   | Public        | Get a single service  |
| POST   | `/`      | Provider only | Create a new service  |
| PUT    | `/:id`   | Provider only | Update own service    |
| DELETE | `/:id`   | Provider only | Delete own service    |

### Bookings (`/api/bookings`)

| Method | Endpoint          | Access        | Description                    |
| ------ | ----------------- | ------------- | ------------------------------ |
| POST   | `/`               | Customer only | Create a booking               |
| GET    | `/my-bookings`    | Customer only | View own bookings              |
| GET    | `/provider`       | Provider only | View incoming booking requests |
| PATCH  | `/:id/status`     | Provider only | Accept or reject a booking     |
| PATCH  | `/:id/complete`   | Provider only | Mark booking as completed      |

### Reviews (`/api/reviews`)

| Method | Endpoint               | Access        | Description                    |
| ------ | ---------------------- | ------------- | ------------------------------ |
| POST   | `/`                    | Customer only | Post a review after completion |
| GET    | `/service/:serviceId`  | Public        | Get reviews for a service      |

### Provider (`/api/providers`)

| Method | Endpoint | Access  | Description                |
| ------ | -------- | ------- | -------------------------- |
| POST   | `/apply` | Private | Apply to become a provider |

### Admin (`/api/admin`)

| Method | Endpoint                   | Access     | Description                    |
| ------ | -------------------------- | ---------- | ------------------------------ |
| GET    | `/providers`               | Admin only | List all provider applications |
| PATCH  | `/providers/:id/approve`   | Admin only | Approve a provider             |
| PATCH  | `/providers/:id/reject`    | Admin only | Reject a provider              |

### Chat (`/api/chat`)

| Method | Endpoint        | Access  | Description                       |
| ------ | --------------- | ------- | --------------------------------- |
| GET    | `/:bookingId`   | Private | Get message history for a booking |

### ⚡ Real-Time Socket Events

| Event             | Direction           | Description                         |
| ----------------- | ------------------- | ----------------------------------- |
| `join_chat`       | Client → Server     | Join a booking's private chat room  |
| `leave_chat`      | Client → Server     | Leave a booking's chat room         |
| `send_message`    | Client → Server     | Send a message to the room          |
| `receive_message` | Server → Client(s)  | Broadcast new message to room       |

<details>
<summary><strong>📋 Example — Create Booking</strong></summary>

**Request**

```http
POST /api/bookings
Authorization: Bearer <customer_jwt>
Content-Type: application/json
```

```json
{
  "serviceId": "6a8ec0c5923190405242d6a5",
  "message": "I need this website built for my business."
}
```

**Response `201`**

```json
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "...",
    "service": "6a8ec0c5923190405242d6a5",
    "customer": "<customer_id>",
    "provider": "6a8ebda0923190405242d6a4",
    "status": "pending",
    "message": "I need this website built for my business.",
    "createdAt": "2026-09-11T...",
    "updatedAt": "2026-09-11T..."
  }
}
```

</details>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** v9+

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Skillbook
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

Start the dev server:

```bash
npm run dev
```

> Backend runs at: `http://localhost:5000`

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

> Frontend runs at: `http://localhost:5173`

---

## 🌐 Frontend Routes

| Path                    | Access        | Page                  |
| ----------------------- | ------------- | --------------------- |
| `/`                     | Public        | Home                  |
| `/login`                | Public        | Login                 |
| `/register`             | Public        | Register              |
| `/services`             | Public        | Browse Services       |
| `/services/:id`         | Public        | Service Detail        |
| `/become-provider`      | Public        | Provider Application  |
| `/dashboard`            | Auth required | Customer Dashboard    |
| `/provider-dashboard`   | Provider only | Provider Dashboard    |
| `/add-service`          | Provider only | Add New Service       |
| `/my-services`          | Provider only | Manage My Services    |
| `/my-services/:id/edit` | Provider only | Edit Service          |
| `/admin-dashboard`      | Admin only    | Admin Dashboard       |

---

## 🧪 Testing the API

Use [Postman](https://www.postman.com/) or any REST client:

1. **Register a provider** → `POST /api/users/register` with `role: "provider"`
2. **Register a customer** → `POST /api/users/register` with `role: "customer"`
3. **Login as provider** → copy the returned JWT
4. **Create a service** → `POST /api/services` with provider JWT in `Authorization` header
5. **Login as customer** → copy the returned JWT
6. **Create a booking** → `POST /api/bookings` with `serviceId` + customer JWT
7. **Check bookings** → `GET /api/bookings/my-bookings` as customer
8. **Accept booking** → `PATCH /api/bookings/:id/status` with `{ "status": "accepted" }` as provider

---

## 🗺️ Roadmap

- [x] JWT authentication with role-based access control
- [x] Service CRUD (provider)
- [x] Booking creation & full lifecycle management
- [x] Customer & provider booking dashboards
- [x] Real-time in-booking chat (Socket.io)
- [x] Reviews & ratings system
- [x] Provider application & admin approval workflow
- [x] Admin dashboard
- [x] React frontend with Vite + Tailwind CSS v4
- [ ] Email notifications (booking accepted/rejected)
- [ ] Payment gateway integration
- [ ] Service image uploads
- [ ] Search & advanced filter for services
- [ ] Deployment (Render / Railway + Vercel)

---

<div align="center">
Made with ❤️ using the MERN stack
</div>
