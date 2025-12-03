# Accounting App

A full-stack accounting application with SQLite database backend and React frontend.

[Live Demo](https://accounting-app-nafiz-365.netlify.app/)

## Features

- User authentication (register/login)
- Chart of Accounts management
- Journal Entries
- Adjusting Entries
- General Ledger
- Trial Balance
- Income Statement
- Balance Sheet
- Multi-currency support
- Dark/Light theme

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   
   Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (optional, defaults to localhost:5000):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Database

- SQLite database is automatically created at `backend/accounting.db`
- All data is user-specific and stored permanently
- Database schema is created automatically on first run

## API Documentation

See `backend/README.md` for detailed API documentation.

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Express.js, SQLite
- **Authentication**: JWT tokens
- **Password Hashing**: bcryptjs
