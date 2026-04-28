# 🎓 Smart Screening – Internship & Job Preparation Platform

Smart Screening is a web-based recruitment and preparation platform designed to streamline internship and job selection for students and companies.  
Instead of reviewing thousands of CVs, companies can evaluate candidates through an AI-powered screening exam system.

This system improves recruitment efficiency, reduces manual work, and ensures candidates are selected based on skills and performance rather than CV content alone.

---

## 🚀 Project Overview

Smart Screening is a full-stack web application built using the **T3 Stack**.  
It enables companies to post job or internship opportunities and automatically filter qualified candidates through an online exam evaluated using AI.

Key idea:

Students must pass an AI-evaluated screening exam before uploading their CV.

This ensures:

- Fair candidate selection
- Reduced workload for companies
- Faster hiring process
- Skill-based evaluation

The system includes secure exam controls such as:

- Tab switching restriction
- Copy/paste prevention
- Browser activity monitoring
- Face verification before exam
- Automatic termination after multiple violations

These controls help maintain exam integrity and reduce cheating.

---

## 🧩 System Modules

The system is divided into 4 main modules.

### 1. Company Management Module

- Company registration and login
- Company verification by admin
- Create job / internship postings
- Define job requirements
- Set minimum exam pass mark
- View qualified candidates
- Schedule interviews
- Send interview notifications

---

### 2. Student Management Module

- Student registration and login
- Profile management
- View available jobs
- Apply for internships
- Receive interview notifications
- Access interview preparation section
- Attempt practice quizzes
- View results and progress

---

### 3. Online Exam & Question Management Module

- Create and manage question bank
- Assign questions to jobs
- Set exam time limits
- Prevent re-attempts
- Submit answers
- Calculate exam score
- Control CV upload permission

---

### 4. AI Evaluation & Candidate Filtering Module

- Store model answers
- Evaluate student answers using AI
- Handle different but correct answers
- Calculate final score
- Compare score with cutoff mark
- Mark candidates as Pass / Fail
- Filter qualified candidates
- Generate evaluation results

---

## 🛠 Tech Stack (T3 Stack)

This project is built using the **T3 Stack**, which provides a modern, type-safe full-stack development environment.

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend

- tRPC
- Node.js
- Prisma ORM

### Database

- LiteSQL

### Authentication

- NextAuth.js

### AI Integration

- OpenAI API

### Testing

- Playwright

### Development Tools

- pnpm
- ESLint
- Prettier

---


---

## ⚙️ Prerequisites

Before running this project, install:

- Node.js (v18 or later)
- pnpm
- PostgreSQL
- Git

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/smart-screening.git
cd smart-screening

## Install Dependencies
-pnpm install
