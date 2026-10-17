# Student Management System (MERN)

A Student Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It lets you add, view, update and delete student records with full CRUD functionality. All data is stored in MongoDB and fetched through the backend API.

## Features

- Add a new student with all required details
- Show students in a clean, responsive table
- Edit student details in a popup form
- Delete a student with a confirmation popup
- Search students by name, email or course
- Dashboard cards that flip to show extra stats (click a card)
- Data stored in MongoDB (not just in the frontend)

## Tech stack

- **React.js** (Vite): UI components, routing (React Router), state
- **Node.js + Express.js**: REST API
- **MongoDB + Mongoose**: database for student records
- **Axios**: API requests
- **CSS**: custom responsive styling
- **lucide-react**: icons

## Project structure

```
student-management-system/
├── api/
│   └── index.js               # Backend entry on Vercel
├── server/                    # Node.js + Express backend
│   ├── config/db.js           # MongoDB connection
│   ├── models/Student.js      # Student schema
│   ├── controllers/studentController.js
│   ├── routes/studentRoutes.js
│   ├── app.js                 # Express app
│   └── local.js               # Starts the API on your laptop
├── src/                       # React frontend
│   ├── components/            # Sidebar, Topbar, StatCard, StudentTable, StudentForm, modals
│   ├── pages/                 # Dashboard, AddStudent, Students
│   ├── services/api.js        # Axios API calls
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── vite.config.js
├── vercel.json
├── package.json               # One package.json for everything
└── .env                       # One env file (MONGODB_URL)
```

## API endpoints

Base URL: `/api` (locally `http://localhost:5000/api`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check the API and database connection |
| POST | `/students` | Add a new student |
| GET | `/students` | Get all students |
| GET | `/students/:id` | Get one student by ID |
| PUT | `/students/:id` | Update a student |
| DELETE | `/students/:id` | Delete a student |

### Sample record

```json
{
  "_id": "64f3e2a1c8b6d2e3f1a7",
  "studentName": "Ayesha Khan",
  "email": "ayesha@test.com",
  "fatherName": "Ahmed Khan",
  "courseName": "BS Computer Science",
  "feeStructure": 5000,
  "subjects": ["Math", "Programming", "Database"],
  "classTiming": "Morning (9:00 AM - 12:00 PM)",
  "status": "Active",
  "createdAt": "2026-10-17T08:30:00.000Z",
  "updatedAt": "2026-10-17T08:30:00.000Z"
}
```

## Run on your laptop

1. Create a `.env` file (copy `.env.example`) and set `MONGODB_URL`
2. Install and start:

```bash
npm install
npm run dev
```

3. Open http://localhost:5173

One command starts both the API (port 5000) and the React app (port 5173).

## Deploy on Vercel

1. Push this project to GitHub
2. On Vercel: **Add New → Project** → import the repo
3. Root Directory: `./` (leave as is). Framework Preset: **Vite**
4. Environment Variables: `MONGODB_URL` = your MongoDB Atlas connection string
5. Deploy, then open `/api/health` on your site to check the database connection
