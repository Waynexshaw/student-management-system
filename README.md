# Student Management System

A full-stack Student Management System built to manage student records through a responsive web interface.

The application allows users to create, view, update, and delete student records while demonstrating the complete flow between a frontend application, REST API, and PostgreSQL database.

## Live Application

**Frontend**

https://frontend-waynex.vercel.app

**Backend API**

https://backend-waynex.vercel.app

**GitHub Repository**

https://github.com/Waynexshaw/student-management-system

---

## Features

- Dashboard showing total students, departments, and levels
- View all students
- Add a new student
- View individual student details
- Edit student information
- Delete student records
- Form validation
- Duplicate email handling
- Loading states
- Empty states
- Error handling
- Responsive desktop and mobile interface
- REST API connected to PostgreSQL

---

## Student Information

Each student record contains:

- Name
- Email
- Phone
- Department
- Level
- Date created

The database automatically generates the student ID and creation timestamp.

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- CSS
- Fetch API

### Backend

- Node.js
- Express.js
- node-postgres (`pg`)
- CORS
- dotenv

### Database

- PostgreSQL
- Supabase hosted PostgreSQL

### Deployment

- Vercel

---

## Application Architecture

The application follows this full-stack flow:

```text
User
  ↓
React Frontend
  ↓
Fetch API Request
  ↓
Express Backend
  ↓
PostgreSQL Query
  ↓
Supabase PostgreSQL Database
  ↓
Database Result
  ↓
Express JSON Response
  ↓
React Frontend
  ↓
Updated User Interface
```

The frontend does not connect directly to the database.

All database operations pass through the Express REST API.

---

## API Endpoints

Base URL:

```text
https://backend-waynex.vercel.app
```

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get one student |
| POST | `/api/students` | Create a student |
| PATCH | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

### Example Successful Response

```json
{
  "success": true,
  "students": []
}
```

### Example Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## HTTP Status Codes

The API uses appropriate HTTP status codes:

- `200` — Successful GET, update, or delete
- `201` — Student created successfully
- `400` — Invalid request or input
- `404` — Student not found
- `409` — Email already exists
- `500` — Server or database error

---

## Database Schema

The application uses a PostgreSQL `students` table.

```sql
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    level TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

The `email` field is unique to prevent duplicate student records using the same email address.

---

## Project Structure

```text
student-management-system/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── studentApi.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── studentController.js
│   │   ├── routes/
│   │   │   └── studentRoutes.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── .gitignore
└── README.md
```

---

## Environment Variables

Environment variables are used so database credentials and deployment configuration are not hardcoded into the application.

### Backend

Create:

```text
backend/.env
```

Example:

```env
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=postgres
DB_USER=your_database_user
DB_PASSWORD=your_database_password
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000
```

Actual credentials should never be committed to GitHub.

---

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Waynexshaw/student-management-system.git
```

```bash
cd student-management-system
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create the backend `.env` file and add the required environment variables.

Start the backend:

```bash
npm run dev
```

The backend runs locally at:

```text
http://localhost:5000
```

### 3. Install Frontend Dependencies

Open another terminal from the project directory:

```bash
cd frontend
npm install
```

Create the frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Vite will provide the local frontend URL, normally:

```text
http://localhost:5173
```

---

## CRUD Flow

### Create

The Add Student form sends a `POST` request to the backend. The backend validates the information and inserts the student into PostgreSQL.

### Read

The frontend sends `GET` requests to retrieve either all students or an individual student.

### Update

The Edit Student form sends a `PATCH` request containing the updated information. The backend updates the corresponding PostgreSQL record.

### Delete

The frontend sends a `DELETE` request after the user confirms deletion. The backend removes the student from the database.

---

## Validation and Error Handling

The application handles situations such as:

- Missing required information
- Invalid student IDs
- Duplicate email addresses
- Student not found
- Database/server errors
- Failed API requests

The frontend also provides loading, empty, and error states so the user receives feedback while interacting with the system.

---

## Responsive Design

The interface is designed for both desktop and mobile devices.

On desktop, students are presented using a table-based layout.

On smaller screens, the interface adapts to a mobile-friendly layout while maintaining access to all CRUD operations.

---

## Security

Database credentials are stored in backend environment variables.

The React frontend only knows the backend API URL and does not contain PostgreSQL credentials.

Environment files, dependencies, and generated build files are excluded from Git where appropriate.

---

## Author

**Waynexshaw**

GitHub: https://github.com/Waynexshaw