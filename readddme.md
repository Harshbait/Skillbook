# SkillBook 🚀

SkillBook is a MERN-stack service marketplace where customers can discover services, book providers, and leave reviews.

## Tech Stack

- MongoDB
- Express.js
- React.js
- Node.js
- JWT
- Mongoose

## User Roles

### Customer
- Browse services
- Book services
- View bookings
- Review completed services
- Apply to become a provider

### Provider
- Create services
- Update services
- Delete services
- View incoming bookings
- Accept/reject bookings
- Complete bookings

### Admin
- View provider applications
- Approve providers
- Reject providers
- Manage the platform

## Main API Routes

### Authentication

POST `/api/users/register`

POST `/api/users/login`

GET `/api/users/profile`

### Services

GET `/api/services`

GET `/api/services/:id`

POST `/api/services`

PUT `/api/services/:id`

DELETE `/api/services/:id`

### Bookings

POST `/api/bookings`

GET `/api/bookings/my-bookings`

GET `/api/bookings/provider`

PATCH `/api/bookings/:id/status`

PATCH `/api/bookings/:id/complete`

### Reviews

POST `/api/reviews`

GET `/api/reviews/service/:serviceId`

### Provider

POST `/api/providers/apply`

### Admin

GET `/api/admin/providers`

PATCH `/api/admin/providers/:id/approve`

PATCH `/api/admin/providers/:id/reject`

## Environment Variables

Create a `.env` file:

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

PORT=5000

## Run Backend

```bash
npm install
npm run dev