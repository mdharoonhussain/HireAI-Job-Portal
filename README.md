# Hire AI Job Portal

A full-stack Job Portal application that connects Candidates and Recruiters through a modern hiring platform. Candidates can create profiles, upload resumes, search and apply for jobs, while Recruiters can post jobs, manage applicants, and track hiring progress.

## Live Demo

Frontend: https://hireai-portal.netlify.app/

## Features

### Candidate Features

- User Registration & Login
- JWT Authentication
- Profile Management
- Upload Resume & Profile Photo
- Browse Available Jobs
- Search and Filter Jobs
- Apply for Jobs
- Track Application Status

### Recruiter Features

- Recruiter Registration & Login
- Company Profile Management
- Create, Edit, and Delete Job Posts
- View Applicants for Posted Jobs
- Shortlist Candidates
- Reject Applications
- Mark Candidates as Hired
- Recruiter Dashboard & Statistics

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication

- JWT (JSON Web Tokens)
- bcryptjs

### File Uploads

- Multer
- Cloudinary

### Deployment

- Frontend: Netlify
- Backend: Render
- Database: MongoDB Atlas

## Project Structure

```bash
HireAI-Job-Portal/
│
├── frontend/
│   ├── candidate/
│   ├── recruiter/
│   ├── css/
│   ├── js/
│   └── images/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone <your-repository-url>
cd HireAI-Job-Portal
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Run Backend:

```bash
npm run dev
```

### Frontend Setup

Open the frontend folder using VS Code Live Server or any local server.

## API Modules

### Authentication

- Register User
- Login User

### User Management

- Get Profile
- Update Profile

### Job Management

- Create Job
- Get All Jobs
- Get Recruiter Jobs
- Update Job
- Delete Job

### Application Management

- Apply for Job
- View Applied Jobs
- View Applicants
- Update Application Status
- Recruiter Statistics

## Key Highlights

- Role-Based Access Control (Candidate & Recruiter)
- Secure JWT Authentication
- Resume Upload using Cloudinary
- Real-Time Application Tracking
- Responsive UI Design
- RESTful API Architecture
- MongoDB Relationship Modeling

## Future Enhancements

- AI Resume Analyzer Integration
- AI Candidate Matching
- Email Notifications
- Interview Scheduling
- Saved Jobs Feature
- Admin Dashboard
- Real-Time Notifications

## Author

**Md Haroon Hussain**

Full Stack Web Developer

LinkedIn: linkedin.com/in/md-haroon-hussain-b730561b3

GitHub: https://github.com/mdharoonhussain
