# 🏥 Hospital Management System (MERN Stack)

[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://www.mongodb.com/)  
[![Express](https://img.shields.io/badge/Express-Backend-blue.svg)](https://expressjs.com/)  
[![React](https://img.shields.io/badge/React-Frontend-61DAFB.svg)](https://reactjs.org/)  
[![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933.svg)](https://nodejs.org/)

---

## 🔍 Overview

The **Hospital Management System** is a full-stack web application designed to enhance the efficiency of hospital workflows. It provides role-based dashboards for **patients**, **staff**, and **admin**, handling everything from appointment scheduling to financial reporting. Built using the **MERN stack**, the system follows best practices for responsive design, RESTful APIs, and clean architecture.

---

## ✨ Features

- 🧑‍⚕️ Role-Based Authentication (Patients, Doctors, Admin)
- 📋 Patient Management (EHR, Appointments, Reminders)
- 👨‍⚕️ Doctor Management (Schedules, Availability)
- 🧑‍💼 Admin Dashboard (Department, Staff, Notifications)
- 💳 Financial Dashboard (Revenue, Billing, Insurance)
- 📊 Real-time Visualizations (using Recharts)
- ⚙️ Error Handling, Secure Auth, and Role Access Control
- 🎨 Responsive UI using Tailwind CSS

---

## 📊 Dashboard Modules

### 1. Patient Dashboard
- **Focus:** All aspects of patient management  
- **Features:**
  - Electronic Health Records (EHR)
  - Appointment tracking and reminders
  - Admissions/discharges automation
  - SMS/Email updates (e.g. test results)

### 2. Staff Dashboard
- **Focus:** Attendance, scheduling, and shift management  
- **Features:**
  - Roster with duty/schedule overview
  - Clock-in/out tracking and leave logs
  - Shift change notifications
  - Staffing workload overview

### 3. Financial Dashboard ✅ *(Newly Added)*
- **Focus:** Billing, revenue, insurance, and overdue tracking  
- **Features:**
  - Daily/monthly bill tracking
  - Insurance claims submission & approval
  - Revenue trend charts (Recharts)
  - Overdue payment alerts

---

## 🛠 Tech Stack

### 🔹 Frontend
- React
- React Router
- Tailwind CSS
- Lucide Icons
- Axios
- Recharts (for financial and patient dashboard charts)
- Framer Motion (smooth transitions)

### 🔸 Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (authentication)
- dotenv (env management)
- Nodemon (dev server auto-restart)

---

## ⚙️ Getting Started

### ✅ Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### 🚀 Setup Instructions

1. **Clone Repository**
   ```bash
   git clone https://github.com/MKPTechnicals/Hospital-Management-System-MERN.git
api routes:
  /patient: Patient page
  /doctor: Doctor staff page
  /admin: Admin page
  /financial: Finance page
   
cd frontend
npm install
cd backend
npm install
//mongodb
mongoose.connect("<your_mongo_uri>")
//CreateAdmin
const admin = new Admin({
  firstName: "John",
  lastName: "Doe",
  email: "admin@example.com",
  password: "admin123",
  role: "admin"
});
Run Server
cd backend && nodemon server.js
cd frontend && npm start
🧪 Available Scripts
In the frontend directory:

npm start - Run dev server

npm run build - Production build

npm test - Run test suite

npm run eject - Eject config

🧩 Challenges & Fixes
🛠 Doctor DB Bug Fixed: Previously non-functional doctor records were debugged and resolved.

🎨 Patient Dashboard UI Revamped: Added line charts for appointment and admission trends.

💵 Financial Dashboard Implemented: Complete billing & revenue tracking with dynamic charts.

🔐 Auth Page Fixes: Role-based login bug was resolved and protected routes restructured.

🧹 Error Handling Improved: All API endpoints now return proper error codes and messages.

🔄 Animations Added: Used Framer Motion to improve page transitions and dashboard feel.

⏱ Development Time
Task assigned via Loom

Completed in ~10 hours

Light help taken from ChatGPT for optimization & UI suggestions
