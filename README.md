# Task Management System

A full-stack web application built with React, Node.js, Express, and SQLite.

## Features

- ✅ User Authentication (Register/Login)
- ✅ Create, Read, Update, Delete tasks
- ✅ Task categories and priorities
- ✅ Search and filter functionality
- ✅ Responsive design
- ✅ RESTful API
- ✅ Database persistence

## Tech Stack

- **Frontend**: React 18, TypeScript, CSS3
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Authentication**: JWT tokens

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Start development servers**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root package.json
└── README.md        # Project documentation
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Features for Placement Interview

This project demonstrates:
- Full-stack development skills
- RESTful API design
- Database operations
- Authentication & Authorization
- Modern JavaScript/TypeScript
- React hooks and state management
- Responsive web design
- Git version control best practices
