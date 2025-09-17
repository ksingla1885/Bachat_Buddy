# BachatBuddy - Personal Finance Manager

A comprehensive personal finance management application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User Authentication with JWT
- Multiple Wallet Management
- Transaction Tracking with Auto-categorization
- Budget Planning and Monitoring
- Recurring Transaction Rules
- Email Alerts for Budget Thresholds
- Dark Mode Support
- Responsive Design
- Interactive Charts and Analytics

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Node-cron for Recurring Tasks
- Nodemailer for Email Notifications

### Frontend
- React
- React Router for Navigation
- React Hook Form for Forms
- Recharts for Charts
- Tailwind CSS for Styling
- Axios for API Calls
- Dark Mode Support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bachatbuddy.git
   cd bachatbuddy
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Copy and configure environment variables
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bachatbuddy
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Seed demo data (optional):
   ```bash
   cd backend
   npm run seed
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile

### Wallets
- GET /api/wallets - Get all wallets
- POST /api/wallets - Create new wallet
- GET /api/wallets/:id - Get wallet details
- PATCH /api/wallets/:id - Update wallet
- DELETE /api/wallets/:id - Delete wallet

### Transactions
- GET /api/transactions - Get all transactions
- POST /api/transactions - Create new transaction
- GET /api/transactions/:id - Get transaction details
- PATCH /api/transactions/:id - Update transaction
- DELETE /api/transactions/:id - Delete transaction

### Budgets
- GET /api/budgets - Get all budgets
- POST /api/budgets - Create new budget
- GET /api/budgets/summary - Get budget summary
- PATCH /api/budgets/:id - Update budget
- DELETE /api/budgets/:id - Delete budget

### Recurring Rules
- GET /api/recurring - Get all recurring rules
- POST /api/recurring - Create new recurring rule
- PATCH /api/recurring/:id - Update recurring rule
- DELETE /api/recurring/:id - Delete recurring rule

## Demo Users

After running the seed script, you can login with these demo accounts:
1. Email: john@example.com / Password: password123
2. Email: jane@example.com / Password: password123

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/NewFeature`
3. Commit your changes: `git commit -m 'Add NewFeature'`
4. Push to the branch: `git push origin feature/NewFeature`
5. Submit a pull request

## License

This project is licensed under the MIT License.
