# Task Manager — Real-time Collaborative Dashboard

Built with **Node.js + Express**, **React**, **MongoDB**, and **Socket.io**.

## Stack
- **Backend**: Node.js, Express.js, Socket.io, Mongoose
- **Frontend**: React 18, Axios, Socket.io-client
- **Database**: MongoDB

## Project Structure
```
task-manager/
├── server/              # Express + Socket.io API
│   ├── config/db.js     # MongoDB connection
│   ├── models/          # Task, Project, User, Activity schemas
│   ├── routes/          # REST API routes
│   └── index.js         # Server entry point
├── client/              # React app
│   └── src/
│       ├── components/  # KanbanColumn, TaskCard, TaskModal, etc.
│       ├── context/     # SocketContext
│       └── utils/       # API calls, time helpers
└── package.json         # Root scripts (run both at once)
```

## Prerequisites
- Node.js v16+
- MongoDB running locally on port 27017
  - Install: https://www.mongodb.com/try/download/community
  - Start: `mongod` or `brew services start mongodb-community`

## Setup & Run

### 1. Install all dependencies
```bash
npm run install:all
```

### 2. Start both server and client
```bash
npm run dev
```

This runs:
- **Server** → http://localhost:5000
- **Client** → http://localhost:3000

### 3. Load demo data
Open http://localhost:3000 and click **"Load Demo Data"** to seed the database with sample tasks, projects, and team members.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | List tasks (filter by project, status, priority) |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |
| GET | /api/projects | List projects |
| POST | /api/projects | Create project |
| POST | /api/projects/seed | Seed demo data |
| GET | /api/activities | Recent activity feed |
| GET | /api/users | Team members |

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| join_project | Client → Server | Subscribe to project updates |
| task_created | Server → Client | New task broadcast |
| task_updated | Server → Client | Task change broadcast |
| task_deleted | Server → Client | Task removal broadcast |
| activity_update | Server → Client | New activity entry |

## Features
- ✅ Kanban board (Backlog / In Progress / Done)
- ✅ Real-time updates via Socket.io
- ✅ Create, edit, delete tasks
- ✅ Assignees, priority, tags, due dates, progress
- ✅ Live activity feed
- ✅ Team panel with active task counts
- ✅ Stats dashboard
- ✅ Filter by priority / due date
