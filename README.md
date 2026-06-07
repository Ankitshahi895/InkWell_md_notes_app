# Markdown Note-Taking Application

A full-stack Markdown Note-Taking Application that enables users to upload, manage, preview, and organize Markdown notes with secure JWT authentication, grammar checking, and user-specific note management.

## Features

* User Registration & Login
* JWT Authentication & Authorization
* User-Specific Notes
* Markdown File Upload (.md)
* Live Markdown Preview
* Grammar Checking using LanguageTool
* Markdown Rendering
* Create, Read, Update, Delete (CRUD) Notes
* Protected Routes
* Responsive UI
* Light/Dark Theme Support
* Secure REST API Integration

## Tech Stack

### Backend

* Java 17
* Spring Boot 3
* Spring Security
* JWT
* Spring Data JPA
* MySQL
* Maven
* LanguageTool
* CommonMark

### Frontend

* React
* Vite
* React Router DOM
* Axios
* React Markdown
* Context API
* CSS

## Project Structure

```text
markdown-note-app/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── application.properties
│
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js
```

## API Endpoints

### Authentication

* POST `/api/auth/register`
* POST `/api/auth/login`

### Notes

* POST `/api/notes`
* GET `/api/notes`
* GET `/api/notes/{id}`
* PUT `/api/notes/{id}`
* DELETE `/api/notes/{id}`

### Markdown

* POST `/api/notes/upload`
* POST `/api/notes/grammar`
* POST `/api/notes/render`

## Getting Started

### Backend

```bash
cd backend
mvn spring-boot:run
```

Runs on:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```text
http://localhost:5173
```

## Key Highlights

* Implemented JWT-based authentication with Spring Security.
* Designed RESTful APIs for note management and file handling.
* Integrated Markdown rendering and grammar analysis features.
* Built a responsive React frontend with protected routes and API integration.
* Ensured user-level data isolation and secure access control.
