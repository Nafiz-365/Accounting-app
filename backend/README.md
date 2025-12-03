# Accounting App Backend

Express.js server with SQLite database for the accounting application.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Server Configuration**
   - Default port: `5000`
   - Database file: `accounting.db` (created automatically)
   - API base URL: `http://localhost:5000/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Accounts
- `GET /api/accounts` - Get all accounts for authenticated user
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Journal Entries
- `GET /api/journal-entries?is_adjusting=false` - Get journal entries
- `GET /api/journal-entries?is_adjusting=true` - Get adjusting entries
- `POST /api/journal-entries` - Create journal entry
- `PUT /api/journal-entries/:id` - Update journal entry
- `DELETE /api/journal-entries/:id` - Delete journal entry

## Database Schema

- **users**: User authentication and profile
- **accounts**: Chart of accounts (user-specific)
- **journal_entries**: Journal and adjusting entries (user-specific)
- **journal_entry_lines**: Individual line items for each entry

All data is user-specific and isolated by `user_id`.

