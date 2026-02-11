# FocusFlow

FocusFlow is a modern productivity application designed to help users manage tasks effectively and track time spent on various activities. Built with **Next.js 16**, **React 19**, and **Tailwind CSS**, it features a clean, responsive interface and robust backend functionality using **Prisma** and **PostgreSQL**.

## 🚀 Features

- **Task Management**: Create, update, and manage tasks.
- **Time Tracking**: Start and stop timers for specific tasks to track duration.
- **Dashboard & Analytics**: Visualize productivity with daily and weekly reports.
- **Authentication**: Secure user authentication with JWT and bcrypt.
- **Modern UI**: A polished, responsive design using Tailwind CSS v4.

## 🛠 Technologies Used

### Frontend & Backend Framework
- **Next.js**: `v16.1.6` (App Router)
- **React**: `v19.2.3`
- **TypeScript**: `v5`

### Styling
- **Tailwind CSS**: `v4`
- **PostCSS**: `v8`

### Database & ORM
- **PostgreSQL**: Relational database
- **Prisma ORM**: `v7.3.0` (with `@prisma/adapter-pg`)

### Authentication
- **JWT (JSON Web Tokens)**: `v9`
- **Bcrypt**: `v6` for password hashing

## ⚙️ Setup Instructions

Follow these steps to run the project locally:

### 1. Clone the repository
```bash
git clone <repository-url>
cd focusflow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following variables:

```env
# Database Connection String (PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# JWT Secret for Authentication
JWT_SECRET="your_secure_jwt_secret_key"
```

### 4. Database Setup
Ensure you have PostgreSQL installed and running. Then, run the Prisma migration to set up the database schema:

```bash
npx prisma migrate dev --name init
```

### 5. Run the Application
Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🗄 Database Schema

The application uses the following main models:

- **User**: Stores user credentials and profile data.
- **Task**: Represents a task item linked to a user.
- **TimeEntry**: Tracks start/end times and duration for tasks.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user.
  - Body: `{ email, password }`
- `POST /api/auth/login` - Authenticate user and receive a token.
  - Body: `{ email, password }`

### Tasks
- `GET /api/tasks` - Get all tasks for the authenticated user (includes time tracking data).
- `POST /api/tasks` - Create a new task.
  - Body: `{ title, description }`
- `GET /api/tasks/[id]` - Get specific task details.
- `DELETE /api/tasks/[id]` - Delete a task.
- `PUT /api/tasks/[id]/complete` - Mark a task as completed.

### Timer
- `GET /api/timer/active` - Check if there is an active timer running.
- `POST /api/timer/start` - Start a timer for a task.
  - Body: `{ taskId }`
- `POST /api/timer/stop` - Stop the currently running timer.
  - Body: `{ taskId }`

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics.
- `GET /api/dashboard/summary` - Get summary metrics.
- `GET /api/dashboard/weekly` - Get weekly activity data.

---

Made with ❤️ using Next.js and Tailwind CSS.
