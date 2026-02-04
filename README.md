# Anything.ai - Full Stack Auth & Dashboard Application

A modern full-stack web application featuring a **fully responsive landing page** with modern minimal design, authentication, user profile management, and a Task CRUD system with a responsive dashboard UI.

![Tech Stack](https://img.shields.io/badge/React-19-blue) ![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-green) ![MongoDB](https://img.shields.io/badge/MongoDB-7-brightgreen) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4)

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Running the Application](#-running-the-application)
- [Demo Credentials](#-demo-credentials)
- [API Documentation](#-api-documentation)
- [Scaling for Production](#-scaling-for-production)

---

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite 7** for blazing-fast development
- **TailwindCSS 4** for styling
- **React Router DOM 7** for routing
- **Axios** for HTTP requests
- **Lucide React** for icons

### Backend
- **Node.js** with ES Modules
- **Express.js 5** as web framework
- **MongoDB 7** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **Morgan** for request logging

### DevOps
- **Docker & Docker Compose** for containerized MongoDB
- **Mongo Express** for database GUI

---

## ✨ Features

### Authentication
- ✅ User Signup with validation
- ✅ User Login with JWT tokens
- ✅ Protected routes (dashboard)
- ✅ Password hashing with bcrypt
- ✅ JWT middleware protection

### Profile Management
- ✅ View user profile
- ✅ Update profile (name, email)
- ✅ Change password

### Task CRUD
- ✅ Create tasks with title, description, status, priority, due date
- ✅ Read tasks (list with filters + single view)
- ✅ Update tasks
- ✅ Delete tasks with confirmation
- ✅ Search tasks by title/description
- ✅ Filter by status and priority

### UI/UX
- ✅ Responsive design (mobile-first)
- ✅ **Full responsive landing page** with modern, minimal design
- ✅ Dark theme
- ✅ Loading states
- ✅ Error handling with clear messages
- ✅ Success notifications
- ✅ Form validation (client + server)
- ✅ Smooth scroll animations with Lenis
- ✅ Logo marquee section
- ✅ Testimonials & FAQ sections

---

## 📁 Project Structure

```
anything/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── taskController.js  # Task CRUD logic
│   ├── middleware/
│   │   └── auth.js            # JWT protection middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── user.js            # Profile routes
│   │   └── tasks.js           # Task CRUD routes
│   ├── utils/
│   │   ├── apiResponse.js     # Response helpers
│   │   └── jwt.js             # JWT utilities
│   ├── validators/
│   │   ├── authValidator.js   # Auth validation rules
│   │   └── taskValidator.js   # Task validation rules
│   ├── .env.example           # Environment template
│   ├── docker-compose.yml     # Docker config
│   ├── package.json
│   └── server.js              # Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── admin/
│   │   │       ├── DashboardLayout.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── SignupPage.tsx
│   │   │   └── dashboard/
│   │   │       ├── DashboardPage.tsx
│   │   │       ├── ProfilePage.tsx
│   │   │       ├── TasksListPage.tsx
│   │   │       ├── CreateTaskPage.tsx
│   │   │       ├── EditTaskPage.tsx
│   │   │       └── TaskDetailPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts         # Axios instance
│   │   │   ├── authService.ts # Auth API calls
│   │   │   └── taskService.ts # Task API calls
│   │   ├── App.tsx            # Main app with routing
│   │   └── main.tsx           # React entry point
│   ├── package.json
│   └── vite.config.ts
│
├── postman/
│   └── Anything-API.postman_collection.json
│
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- Docker Desktop (for MongoDB)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/anything.git
cd anything
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb://appuser:apppassword123@localhost:27017/anything_db?authSource=anything_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```

### 3. Start MongoDB with Docker

```bash
# From backend folder
docker-compose up -d

# Verify containers are running
docker ps
```

This starts:
- MongoDB on port `27017`
- Mongo Express (DB GUI) on port `8081`

### 4. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install
```

---

## ▶️ Running the Application

### Start Backend
```bash
cd backend
npm run dev    # Development with nodemon
# or
npm start      # Production
```
Backend runs on: `http://localhost:5000`

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Access Points
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api/v1 |
| Mongo Express | http://localhost:8081 |

---

## 👤 Demo Credentials

Use the following pre-configured test account to login:

| Field | Value |
|-------|-------|
| Email | `test@example.com` |
| Password | `password123` |

Or create a new account via the signup page at `/signup`.

**Create test user via API:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| PUT | `/auth/password` | Change password | ✅ |

### Profile Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/me` | Get current user profile | ✅ |
| PUT | `/me` | Update user profile | ✅ |

### Task Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/tasks` | List all tasks (with filters) | ✅ |
| GET | `/tasks/:id` | Get single task | ✅ |
| POST | `/tasks` | Create new task | ✅ |
| PUT | `/tasks/:id` | Update task | ✅ |
| DELETE | `/tasks/:id` | Delete task | ✅ |

### Query Parameters for GET /tasks
- `search` - Search in title/description
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)

### Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

See `postman/Anything-API.postman_collection.json` for complete API collection.

---

## 🏗 Scaling for Production

Here's how I would scale this application for production deployment:

### 1. **Deployment & Infrastructure**
- Deploy frontend to **Vercel** or **Netlify** for CDN-backed static hosting
- Deploy backend to **AWS EC2**, **Railway**, or **Render** with auto-scaling
- Use **MongoDB Atlas** for managed, replicated database with automatic backups
- Implement **CI/CD pipeline** with GitHub Actions for automated testing and deployment

### 2. **Security Enhancements**
- Add **refresh tokens** with short-lived access tokens (15min) and longer refresh tokens (7d)
- Implement **rate limiting** using `express-rate-limit` to prevent brute force attacks
- Add **CORS whitelist** for specific domains only
- Use **Helmet.js** for security headers
- Store secrets in **environment variables** via cloud provider's secret management

### 3. **Performance Optimization**
- Add **Redis** for session caching and rate limiting
- Implement **database indexing** on frequently queried fields (email, userId, createdAt)
- Add **pagination** for task lists (already supported via query params)
- Use **compression middleware** for response gzip
- Implement **lazy loading** and **code splitting** on frontend

### 4. **Monitoring & Observability**
- Add **Sentry** or **LogRocket** for error tracking
- Implement **structured logging** with Winston or Pino
- Set up **health check endpoints** for load balancers
- Use **APM tools** like DataDog or New Relic for performance monitoring

### 5. **Database Scaling**
- Add **indexes** on User.email, Task.user, Task.status
- Implement **connection pooling** for MongoDB
- Consider **read replicas** for high-read workloads
- Implement **soft deletes** for data recovery

---

## 📝 License

MIT License - feel free to use this project as a template!

---

## 👨‍💻 Author

**psbvision**

Built with ❤️ for Anything.ai
