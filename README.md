# 🚀 ATS Pro - Applicant Tracking System

A full-stack, production-ready Applicant Tracking System built with **Java Spring Boot** (backend) and **React** (frontend).

![ATS](https://img.shields.io/badge/Java-17-orange) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green) ![React](https://img.shields.io/badge/React-18-blue) ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
---

## 🚀 Deployment

This project is optimized for "Zero-Click" cloud deployment.

### 🐘 Backend & Database (Render)
1.  Connect this repository to [Render.com](https://render.com).
2.  Render will automatically use the `render.yaml` blueprint.
3.  It will set up your **Java Spring Boot service** and a **PostgreSQL database** automatically.

### ⚛️ Frontend (Vercel)
1.  Connect this repository to [Vercel](https://vercel.com).
2.  Set the **Root Directory** to `ats-frontend`.
3.  Vercel will auto-detect the Vite build and deploy your site.

---

## 📋 Features

### Core Features
- ✅ **JWT Authentication** — Secure login/register with role-based access
- ✅ **Role-Based Access Control** — Admin, Recruiter, Candidate
- ✅ **Job Management** — Create, update, delete, toggle job postings
- ✅ **Application Tracking** — Apply for jobs, track status
- ✅ **Resume Upload** — Upload PDF/DOCX/TXT resumes
- ✅ **Skill Extraction** — Automatic skill extraction from resumes
- ✅ **Resume Scoring** — Match resume skills against job requirements
- ✅ **Search & Filter** — Search jobs by keyword, filter by location/type/level
- ✅ **Dashboard Analytics** — Charts and stats for admin/recruiter

### Technical Highlights
- Spring Boot 3.2 with layered architecture (Controller → Service → Repository)
- Spring Security with JWT token-based authentication
- JPA/Hibernate with MySQL
- DTOs and global exception handling
- React 18 with functional components and hooks
- Tailwind CSS for modern dark theme UI
- Axios with interceptors for API calls
- Recharts for dashboard analytics
- Responsive design with glass-morphism effects

---

## 🏗️ Project Structure

```
project/
├── ats-backend/                   # Spring Boot Backend
│   ├── pom.xml
│   └── src/main/java/com/ats/
│       ├── AtsApplication.java    # Main entry point
│       ├── config/                # Security, CORS, JWT filter
│       ├── controller/            # REST controllers
│       ├── dto/                   # Data Transfer Objects
│       ├── exception/             # Custom exceptions & handler
│       ├── model/                 # JPA entities
│       ├── repository/            # Spring Data JPA repos
│       ├── service/               # Business logic
│       └── util/                  # JWT, ResumeParser, ResumeScorer
│
├── ats-frontend/                  # React Frontend
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx                # Router setup
│       ├── main.jsx               # Entry point
│       ├── index.css              # Global styles + Tailwind
│       ├── components/            # Navbar, Layout, ProtectedRoute
│       ├── context/               # AuthContext
│       ├── pages/                 # Login, Register, Dashboard, Jobs, Applications, Resume
│       └── services/              # API service (Axios)
│
├── database/
│   └── schema.sql                 # MySQL schema
│
└── ATS_Postman_Collection.json    # Postman API collection
```

---

## 🛠️ Prerequisites

1. **Java 17+** — [Download](https://www.oracle.com/java/technologies/downloads/)
2. **Maven 3.8+** — [Download](https://maven.apache.org/download.cgi)
3. **Node.js 18+** — [Download](https://nodejs.org/)
4. **MySQL 8.0+** — [Download](https://dev.mysql.com/downloads/)

---

## 🚀 Step-by-Step Setup Instructions

### Step 1: Clone/Setup the Project
```bash
cd project
```

### Step 2: Setup MySQL Database
```bash
# Start MySQL and login
mysql -u root -p

# Create the database
CREATE DATABASE ats_db;
EXIT;
```

Or run the schema file:
```bash
mysql -u root -p < database/schema.sql
```

### Step 3: Configure Backend
Edit `ats-backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 4: Run Backend
```bash
cd ats-backend
mvn clean install
mvn spring-boot:run
```
Backend will start at **http://localhost:8080**

### Step 5: Run Frontend
```bash
cd ats-frontend
npm install
npm run dev
```
Frontend will start at **http://localhost:5173**

---

## ⚡ One-Click Start

To start both the Backend and Frontend simultaneously:

### Windows:
Double-click `start.bat` or run:
```powershell
./start.bat
```

### Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

---

## 🧪 API Testing with Postman

1. Import `ATS_Postman_Collection.json` into Postman
2. Set the `baseUrl` variable to `http://localhost:8080/api`

### Test Flow:
1. **Register** a Recruiter account
2. **Login** — Copy the JWT token from response
3. Set the `token` variable in Postman
4. **Create a Job** posting
5. **Register** a Candidate account
6. **Login** as Candidate
7. **Upload Resume** (PDF/DOCX/TXT)
8. **Apply for Job** — Resume score will be calculated
9. **Check Applications** — View status and score

### Sample API Responses:

**Register:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CANDIDATE"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CANDIDATE"
  }
}
```

**Create Job:**
```json
POST /api/jobs
Authorization: Bearer <token>
{
  "title": "Senior Java Developer",
  "description": "Looking for experienced Java developer...",
  "company": "TechCorp",
  "location": "New York, NY",
  "requiredSkills": "Java, Spring Boot, Hibernate, REST, MySQL",
  "salaryMin": 80000,
  "salaryMax": 120000,
  "jobType": "FULL_TIME",
  "experienceLevel": "SENIOR"
}
```

---

## 🔐 API Endpoints Summary

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/jobs` | Authenticated | List active jobs |
| GET | `/api/jobs/{id}` | Authenticated | Job details |
| POST | `/api/jobs` | Admin/Recruiter | Create job |
| PUT | `/api/jobs/{id}` | Admin/Recruiter | Update job |
| DELETE | `/api/jobs/{id}` | Admin/Recruiter | Delete job |
| GET | `/api/jobs/search?keyword=` | Authenticated | Search jobs |
| GET | `/api/jobs/filter` | Authenticated | Filter jobs |
| POST | `/api/applications/apply/{id}` | Candidate | Apply for job |
| GET | `/api/applications/my-applications` | Candidate | My applications |
| GET | `/api/applications` | Admin/Recruiter | All applications |
| PATCH | `/api/applications/{id}/status` | Admin/Recruiter | Update status |
| POST | `/api/resumes/upload` | Candidate | Upload resume |
| GET | `/api/resumes/my-resume` | Candidate | Get resume info |
| GET | `/api/dashboard/stats` | Admin/Recruiter | Dashboard stats |

---

## 🎯 Resume Scoring Logic

The system automatically:
1. **Extracts text** from uploaded resumes (PDF, DOCX, TXT)
2. **Identifies skills** by matching against a database of 70+ known technical skills
3. **Calculates match score** when applying: `(matched skills / required skills) × 100`

Example:
- Job requires: `Java, Spring Boot, React, MySQL`
- Resume has: `Java, Spring Boot, Python, MySQL`
- Score: **75%** (3 out of 4 skills matched)

---

## 👥 Role Permissions

| Feature | Admin | Recruiter | Candidate |
|---------|-------|-----------|-----------|
| View Dashboard Stats | ✅ | ✅ | ❌ |
| Create/Edit Jobs | ✅ | ✅ | ❌ |
| View All Applications | ✅ | Own jobs only | ❌ |
| Update App Status | ✅ | ✅ | ❌ |
| Apply for Jobs | ❌ | ❌ | ✅ |
| Upload Resume | ❌ | ❌ | ✅ |
| View My Applications | ❌ | ❌ | ✅ |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Recharts, Lucide Icons |
| Backend | Java 17, Spring Boot 3.2, Spring Security |
| Auth | JWT (jjwt 0.12.5) |
| Database | MySQL 8.0, JPA/Hibernate |
| Resume Parsing | Apache PDFBox, Apache POI |
| Build Tools | Maven (Backend), Vite (Frontend) |
| HTTP Client | Axios |

---

## 📄 License

This project is for educational purposes.
