# 🚀 Full-Stack Authentication System

This project is a comprehensive, full-stack authentication system built with the **MERN stack** (MongoDB, Express, React, Node.js) and **TypeScript**. It provides a secure and feature-rich foundation for any modern web application, handling user registration, login, session management, and password recovery with multiple authentication strategies.

<img width="1865" height="893" alt="image" src="https://github.com/user-attachments/assets/007e0e19-a407-4532-8bfb-ccb13e40c6e7" />

---

## ✨ Features

✅ **Email & Password Authentication** — Classic yet secure registration with password hashing (bcrypt).  
✅ **Email OTP Verification** — New users must verify their email with a one-time password (OTP) sent via email (Nodemailer) before they can log in.  
✅ **Google OAuth 2.0 Sign-In** — A seamless, one-click login and registration experience using Google accounts (Passport.js).  
✅ **JWT Session Management** — Uses JSON Web Tokens for stateless and secure session management.  
✅ **Protected Routes** — A backend middleware system protects specific API endpoints, allowing access only to authenticated users.  
✅ **Forgot / Reset Password Flow** — A complete and secure flow for users to reset their password via an email link with an expiring token.  
✅ **Responsive Frontend** — A clean, modern, and responsive UI built with React that handles all authentication views.  
✅ **Full-Stack TypeScript** — End-to-end type safety for robust and maintainable code.

---

## 🛠️ Tech Stack

### Backend

- **Node.js** — JavaScript runtime environment.
- **Express.js** — Web framework for Node.js.
- **TypeScript** — Superset of JavaScript for static typing.
- **MongoDB** — NoSQL database for storing user data.
- **Mongoose** — Object Data Modeling (ODM) library for MongoDB.
- **Passport.js** — Authentication middleware for Node.js (`passport-google-oauth20`).
- **JSON Web Token (JWT)** — For generating and verifying access tokens.
- **Bcrypt.js** — For hashing user passwords.
- **Nodemailer** — For sending OTP and password reset emails.
- **Dotenv** — For managing environment variables.

### Frontend

- **React.js** — A JavaScript library for building user interfaces.
- **React Router DOM** — For client-side routing and navigation.
- **Axios** — For making HTTP requests to the backend API.
- **React Toastify** — For user-friendly notifications.
- **React OTP Input** — For a polished OTP entry experience.
- **CSS** — Custom styling for a modern look and feel.

---

## ⚙️ Project Setup and Installation

Follow these steps to get the project running on your local machine.

---

### ✅ Prerequisites

- Node.js (v16 or later)
- npm (comes with Node.js)
- MongoDB installed locally or a connection string from MongoDB Atlas.
- A Google Account for setting up OAuth and Nodemailer (with an App Password).

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ash22686/Authenticator.git
cd Authenticator
```

---

## 2️⃣ Backend Setup

Navigate to the backend directory and install the necessary dependencies:

```bash
cd server
npm install
```

---

### 🔑 Environment Variables

Create a `.env` file in the `server` directory. This file stores all your secret keys and configuration variables. **This file is included in `.gitignore` and should never be committed to version control.**

Fill it with your own credentials:

```env
# --- Server & Database ---
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@<your-cluster-url>/yourDatabaseName?retryWrites=true&w=majority

# --- JSON Web Token ---
JWT_SECRET=your-super-secret-and-long-key-for-jwt

# --- Email Service (Nodemailer with a Google App Password) ---
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your16characterapppassword

# --- Google OAuth 2.0 Credentials ---
GOOGLE_CLIENT_ID=your-client-id-from-google.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# --- Frontend URL for Redirects ---
FRONTEND_URL=http://localhost:3000
```

---

**ℹ️ Note on Credentials:**

- **EMAIL_PASS** — You must use a 16-character App Password generated from your Google Account security settings, not your regular password.
- **Google OAuth** — You must create a project in the Google Cloud Console, create OAuth 2.0 credentials, and ensure:
  - `http://localhost:3000` is listed under **Authorized JavaScript origins**
  - `http://localhost:5001/api/auth/google/callback` is listed under **Authorized redirect URIs**

---

## 3️⃣ Frontend Setup

In a new terminal window, navigate to the frontend directory and install its dependencies:

```bash
cd client
npm install
```

---

## 4️⃣ Running the Application

You’ll need two terminals running simultaneously:

### 🖥️ Terminal 1 — Start Backend

```bash
npm run dev
```

The backend server will start on [http://localhost:5001](http://localhost:5001).

---

### 💻 Terminal 2 — Start Frontend

```bash
npm start
```

The React development server will start and open [http://localhost:3000](http://localhost:3000).

You can now interact with the full application!

---

## 🔗 API Endpoints

All authentication-related endpoints are prefixed with `/api/auth`. The user profile endpoint is prefixed with `/api/users`.

| Method | Endpoint                           | Description                                          | Access   |
|--------|------------------------------------|------------------------------------------------------|----------|
| POST   | `/api/auth/register`               | Register a new user with email and password.         | Public   |
| POST   | `/api/auth/verify-otp`             | Verify the OTP sent to a new user's email.           | Public   |
| POST   | `/api/auth/login`                  | Log in a verified user with email and password.      | Public   |
| GET    | `/api/auth/google`                 | Initiates the Google OAuth 2.0 sign-in flow.         | Public   |
| GET    | `/api/auth/google/callback`        | The callback URL for Google to redirect to.          | Public   |
| POST   | `/api/auth/forgot-password`        | Sends a password reset link to the user's email.     | Public   |
| PUT    | `/api/auth/reset-password/:token`  | Resets the user's password using the provided token. | Public   |
| GET    | `/api/users/profile`               | Gets the profile of the currently logged-in user.    | Private  |

---
