#  TaskFlow API

TaskFlow is a RESTful Task Management API built with **Node.js**, **Express.js**, **MongoDB**, **Redis**, and **BullMQ**. It provides secure authentication, task management, email verification, password recovery, Redis caching, and background job processing for task reminders.

---

##  Features

### Authentication

* User Registration
* Email Verification (OTP)
* Login & Logout
* JWT Access Token
* Refresh Token Authentication
* Forgot Password
* Reset Password

### Task Management

* Create Task
* Update Task
* Delete Task (Soft Delete)
* Restore Deleted Task
* View Single Task
* View All Tasks
* Pagination
* Search
* Filter & Sort

### Background Jobs

* Email Verification Queue
* Forgot Password Email Queue
* Task Reminder Queue
* Retry Failed Jobs
* Delayed Jobs
* Job Priority

### Performance

* Redis Caching
* Automatic Cache Invalidation
* Faster API Responses

### Security

* Password Hashing (bcrypt)
* Protected Routes
* Rate Limiting
* Request Validation
* HTTP-only Refresh Token Cookies

---

## 🛠 Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* Redis
* BullMQ
* JWT
* Nodemailer
* bcrypt
* express-validator

---

##  Project Structure

```text
src/
│── config/
│── controllers/
│── middlewares/
│── models/
│── queues/
│── routes/
│── services/
│── utils/
│── validators/
│── workers/
```

---

##  Installation

```bash
git clone <repository-url>

cd TaskFlow

npm install

npm run dev
```

Make sure MongoDB and Redis are running before starting the server.

---

##  Environment Variables

Create a `.env` file in the project root.

```env
PORT=

MONGO_URI=

JWT_SECRET=

JWT_REFRESH_SECRET=

EMAIL_USER=

EMAIL_PASS=

REDIS_HOST=

REDIS_PORT=
```

---

##  API Endpoints

### Authentication

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | /api/auth/register       |
| POST   | /api/auth/verify-email   |
| POST   | /api/auth/login          |
| POST   | /api/auth/refresh-token  |
| POST   | /api/auth/logout         |
| POST   | /api/auth/forgetPass     |
| POST   | /api/auth/reset-password |

### Tasks

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | /api/tasks             |
| GET    | /api/tasks             |
| GET    | /api/tasks/:id         |
| PUT    | /api/tasks/:id         |
| DELETE | /api/tasks/:id         |
| GET    | /api/tasks/trash       |
| PATCH  | /api/tasks/:id/restore |

### User

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/profile/profile |

---

##  Future Improvements

* Google OAuth Login
* Role-Based Access Control
* File Attachments
* Recurring Task Scheduler
* Docker Support
* Unit & Integration Testing
* API Documentation with Swagger

---

##  Author

**Abdullah Iftikhar**

Backend Developer

Built with using Node.js, Express, MongoDB, Redis, and BullMQ.
