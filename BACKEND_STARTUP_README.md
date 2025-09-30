# Backend Server Startup Instructions

## If you're seeing "Backend server not running on port 5001" error:

### Step 1: Start the Backend Server
1. Open a new terminal/command prompt
2. Navigate to the backend directory:
   ```bash
   cd "c:\Users\ketan\OneDrive\Desktop\Bachat_Buddy\backend"
   ```
3. Install dependencies (if not already done):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   OR
   ```bash
   node server.js
   ```

### Step 2: Check if Server is Running
- The server should display: "🚀 Server running on http://localhost:5001"
- If you see MongoDB connection errors, check your .env file has the correct MONGODB_URI

### Step 3: Verify Backend is Working
- Open browser and go to: http://localhost:5001/api/wallets
- You should see a JSON response (may be empty array if no wallets exist)

### Common Issues:
1. **Port already in use**: Close other applications using port 5001
2. **MongoDB connection**: Make sure MongoDB is running and MONGODB_URI is correct
3. **Dependencies**: Run `npm install` in the backend directory
4. **Firewall**: Allow Node.js through Windows Firewall

### Frontend Development:
- Make sure the frontend dev server is running on port 3000:
  ```bash
  cd "c:\Users\ketan\OneDrive\Desktop\Bachat_Buddy\frontend"
  npm run dev
  ```

### Testing the Connection:
After starting both servers, refresh the wallets page. You should see either:
- Your existing wallets (if any)
- "No wallets found" message (if no wallets exist)
- Clear error message explaining what went wrong
