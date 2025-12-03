# 📊 Accounting App

A modern accounting application with React frontend and Express.js backend, featuring complete double-entry bookkeeping.

[![Live Demo](https://img.shields.io/badge/Demo-Live-blue)](https://accounting-app-nafiz-365.netlify.app/)

## ✨ Features

- 🔐 User authentication (register/login)
- 📋 Chart of Accounts management
- 📝 Journal Entries and adjusting entries
- 📊 Financial reports (General Ledger, Trial Balance, Income Statement, Balance Sheet)
- 💱 Multi-currency support
- 🌓 Dark/Light theme
- 📱 Responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)

### Installation

1. **Clone and setup**

   ```bash
   git clone https://github.com/yourusername/accounting-app.git
   cd accounting-app
   ```

2. **Backend**

   ```bash
   cd backend
   npm install
   npm start
   ```

   Server runs on `http://localhost:5000`

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

### Environment Variables (Optional)

Create `.env` in frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
accounting-app/
├── backend/
│   ├── server.js           # Main Express server
│   ├── package.json        # Backend dependencies
│   └── accounting.db       # SQLite database (auto-created)
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── layout/        # Layout components
│   │   ├── contexts/      # React contexts
│   │   └── utils/         # Utility functions
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
└── README.md
```

## 🔧 Technology Stack

**Frontend**

- React 19.2.0
- Vite 7.2.4
- Tailwind CSS
- Lucide React (icons)

**Backend**

- Express.js 4.18.2
- SQLite 5.1.6
- JWT authentication
- bcryptjs (password hashing)

## 📊 Database Schema

- **users** - User authentication
- **accounts** - Chart of accounts (user-specific)
- **journal_entries** - Journal entries (user-specific)
- **journal_entry_lines** - Entry line items

All data is isolated by user_id for security.

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Accounts

- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Journal Entries

- `GET /api/journal-entries` - Get entries
- `POST /api/journal-entries` - Create entry
- `PUT /api/journal-entries/:id` - Update entry
- `DELETE /api/journal-entries/:id` - Delete entry

## 🎯 Usage

1. Register or login to create your account
2. Default chart of accounts is created automatically
3. Create journal entries for transactions
4. Generate financial reports from the dashboard

## 🛠️ Development

```bash
# Frontend development
cd frontend && npm run dev

# Backend development
cd backend && npm run dev

# Build for production
cd frontend && npm run build
```

## 📝 License

MIT License

## 🐛 TODO

- [ ] Test default account creation and journal entry functionality
- [ ] Add data export features (CSV, PDF)
- [ ] Implement account reconciliation
- [ ] Add financial ratios and analytics

---

**Built with ❤️ for modern accounting needs**
