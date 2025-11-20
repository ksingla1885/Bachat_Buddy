# Leaderboard System - Testing Guide

This guide walks through testing the complete Leaderboard System that was just implemented.

## Overview

The Leaderboard System includes:
- **Backend**: Model, Service, Controller, Routes, Cron Jobs, Debug Endpoints
- **Frontend**: React page with Monthly/Lifetime tabs, User stats, Rankings, Badges
- **Points System**: Automatic point awarding for various financial activities
- **Badge System**: Automatic badge assignment based on rankings

## Prerequisites

1. **Backend running**: Node.js + Express + MongoDB
2. **Frontend running**: React with Vite
3. **MongoDB**: Connected and accessible
4. **Test users**: Should have some user accounts in the database

## Step 1: Verify Backend Setup

### Check if leaderboard routes are loaded

```bash
# In backend directory
cd backend
npm start
```

**Expected Output**: Server running on port 5001 (or configured port)

### Test public API endpoints (no auth required)

```bash
# Get monthly leaderboard
curl -X GET "http://localhost:5001/api/leaderboard/monthly?limit=10"

# Get lifetime leaderboard  
curl -X GET "http://localhost:5001/api/leaderboard/lifetime?limit=10"

# Get top 3 users
curl -X GET "http://localhost:5001/api/leaderboard/top-three"

# Get full leaderboard
curl -X GET "http://localhost:5001/api/leaderboard/full"
```

**Expected Response Format**:
```json
{
  "status": "success",
  "data": [
    {
      "rank": 1,
      "username": "john_doe",
      "monthlyPoints": 250,
      "badges": ["saver_king"]
    }
  ]
}
```

## Step 2: Populate Leaderboard with Existing Users

### Option A: Using API Endpoint (RECOMMENDED)

```bash
# From your project root directory
curl -X POST "http://localhost:5001/api/debug/populate-leaderboard"
```

**Expected Output**:
```json
{
  "status": "success",
  "message": "Leaderboard populated successfully",
  "stats": {
    "totalUsers": 5,
    "processedEntries": 5,
    "averagePoints": 150,
    "maxPoints": 400,
    "minPoints": 0
  },
  "topUsers": [
    { "rank": 1, "username": "user1", "lifetimePoints": 400, "badges": ["saver_king"] },
    { "rank": 2, "username": "user2", "lifetimePoints": 350, "badges": ["top_saver"] }
  ]
}
```

### Option B: Using Node Script

```bash
cd backend
node scripts/populateLeaderboard.js
```

**Expected Output** (formatted table):
```
Leaderboard Population Complete!

Top 10 Users:
┌─────┬──────────────────┬──────────────────┬──────────────┐
│ Rank│ Username         │ Lifetime Points  │ Badges       │
├─────┼──────────────────┼──────────────────┼──────────────┤
│  1  │ Sarah Smith      │ 450              │ 👑 Saver King│
│  2  │ John Doe         │ 380              │ ⭐ Top Saver │
│  3  │ Emma Johnson     │ 320              │ ⭐ Top Saver │
│  4  │ Michael Brown    │ 250              │ ✨ Smart Saver
└─────┴──────────────────┴──────────────────┴──────────────┘

Statistics:
  Total Users: 4
  Average Points: 300
  Max Points: 450
  Min Points: 250
```

### Option C: Manual Steps Using Postman/cURL

1. **First, get leaderboard stats**:
```bash
curl -X GET "http://localhost:5001/api/debug/leaderboard-stats"
```

2. **Populate**:
```bash
curl -X POST "http://localhost:5001/api/debug/populate-leaderboard"
```

3. **Verify stats changed**:
```bash
curl -X GET "http://localhost:5001/api/debug/leaderboard-stats"
```

## Step 3: Test Protected User Stats Endpoint

### Get User Stats (requires authentication)

You need to include a valid JWT token in the Authorization header:

```bash
# Replace YOUR_JWT_TOKEN with actual token from login response
curl -X GET "http://localhost:5001/api/leaderboard/user/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response**:
```json
{
  "status": "success",
  "data": {
    "username": "john_doe",
    "monthlyRank": 2,
    "monthlyPoints": 180,
    "lifetimeRank": 3,
    "lifetimePoints": 450,
    "badges": ["top_saver", "smart_saver_monthly"]
  }
}
```

### Get User Rank Context

```bash
curl -X GET "http://localhost:5001/api/leaderboard/user/context?type=monthly&range=2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

This returns the user with their immediate neighbors (above/below in ranking).

## Step 4: Test Frontend

### 1. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

### 2. Navigate to Leaderboard

1. Open http://localhost:5173 (or your frontend port)
2. Log in with your test account
3. Navigate to **Achievements → Leaderboard**
4. Or use direct URL: http://localhost:5173/leaderboard

### 3. Verify Frontend Display

You should see:

1. **Header**: "Savings Leaderboard" with Trophy icon
2. **Your Performance Section**:
   - Monthly Rank: #X
   - Monthly Points: Y
   - Lifetime Rank: #X
   - Lifetime Points: Y
   - Your Badges (if any): 👑 ⭐ ✨

3. **Tabs**: Monthly | Lifetime (switchable)

4. **Leaderboard Table** showing:
   - Rank with medal emojis for top 3 (🥇🥈🥉)
   - Username
   - Points
   - Badges

5. **How to Earn Points** section:
   - 💰 Stay under budget: +50 points
   - 🎯 Complete goals: +100 points
   - 💵 Monthly savings: +5 points per ₹1000 saved
   - 🔗 Pay off debts: +10 points per ₹1000 paid

6. **Badges** section explaining:
   - 👑 Saver King: Rank #1
   - ⭐ Top Saver: Rank 2-3
   - ✨ Smart Saver: Rank 4-10

### 4. Test Interactivity

1. **Switch Tabs**: Click Monthly/Lifetime buttons
   - Should show different rankings
   - Points should update accordingly

2. **Check Your Stats**: Your Performance section should show your current position

3. **Look for Empty State**: If no data, should show "No leaderboard data available yet"

## Step 5: Test Point Earning

### 1. Create a Transaction

Create a transaction that stays under your budget threshold:
1. Go to Dashboard → Transactions
2. Add a transaction
3. Verify it's within budget
4. Save it

**Expected Result**: 
- +50 points awarded to your account
- Leaderboard updates automatically
- Your rank may change if this pushes you up

### 2. Complete a Goal

1. Go to Goals
2. Create a goal or complete an existing one
3. Save it

**Expected Result**:
- +100 points awarded
- Leaderboard updates
- Your stats update in real-time

### 3. Make a Debt Payment

1. Go to Debt Tracker
2. Pay off a portion or all of a debt
3. Save it

**Expected Result**:
- Points awarded: 10 × (amount in thousands)
- Example: Pay ₹2000 = 20 points
- Leaderboard updates

## Step 6: Troubleshooting

### Issue: "No leaderboard data available yet"

**Solutions**:
1. Run the populate endpoint: `POST /api/debug/populate-leaderboard`
2. Check if MongoDB is connected
3. Verify Leaderboard collection exists: 
   ```bash
   db.leaderboards.count()  # in MongoDB shell
   ```
4. Check backend logs for errors

### Issue: User Stats showing as empty

**Solutions**:
1. Verify JWT token is valid
2. Check if user is logged in correctly
3. Run: `POST /api/debug/populate-leaderboard` again
4. Verify userId in token matches a user in database

### Issue: Points not updating after transaction

**Solutions**:
1. Check if `updateUser` is being called in userController
2. Verify PointsLog entries are being created
3. Check backend console for errors
4. Run `POST /api/debug/recalculate-leaderboard` to manually recalculate

### Issue: Badges not showing

**Solutions**:
1. Ensure calculateRanks is being called
2. Check badge assignment logic in leaderboardService
3. Run `POST /api/debug/recalculate-leaderboard` manually
4. Check if points are high enough for badge tier (top 10)

### Issue: Monthly Reset not working

**Solutions**:
1. Verify cron job is running: Check server logs for "Leaderboard monthly reset executed"
2. Manually reset: `POST /api/debug/reset-monthly-leaderboard`
3. Check node-cron is installed: `npm list node-cron`
4. Verify cron schedule: "5 0 1 * * *" = 1st month at 00:05 AM UTC

## Step 7: Database Verification

### Check Leaderboard Collection

Using MongoDB Shell or MongoDB Compass:

```javascript
// Count entries
db.leaderboards.countDocuments()

// View sample entry
db.leaderboards.findOne()

// View top 5
db.leaderboards.find().sort({ lifetimePoints: -1 }).limit(5)

// Check indexes
db.leaderboards.getIndexes()
```

### Check PointsLog Collection

```javascript
// View recent point logs
db.pointslogs.find().sort({ createdAt: -1 }).limit(10)

// Aggregate points by user
db.pointslogs.aggregate([
  {
    $group: {
      _id: "$userId",
      totalPoints: { $sum: "$pointsAwarded" },
      count: { $sum: 1 }
    }
  },
  { $sort: { totalPoints: -1 } },
  { $limit: 10 }
])
```

## Testing Checklist

- [ ] Backend running and leaderboard routes accessible
- [ ] API endpoints return data (public endpoints tested)
- [ ] Leaderboard populated with user data
- [ ] Frontend page loads successfully
- [ ] Your Performance section displays correctly
- [ ] Monthly tab shows correct data
- [ ] Lifetime tab shows correct data
- [ ] Badges display correctly for top users
- [ ] Can create transaction and earn +50 points
- [ ] Can complete goal and earn +100 points
- [ ] Can make debt payment and earn points
- [ ] Real-time leaderboard updates
- [ ] Monthly reset runs on 1st of month
- [ ] User stats endpoint works with auth

## Expected Point Values

Based on the system configuration:

| Activity | Points |
|----------|--------|
| Stay under budget | 50 |
| Complete goal | 100 |
| Monthly savings (per ₹1000) | 5 |
| Debt payment (per ₹1000) | 10 |

**Example Points Calculation**:
- Create budget + stay under = 50
- Complete goal = 100
- Save ₹5000 = 25 points (5 × 5)
- Pay ₹3000 debt = 30 points (10 × 3)
- **Total: 205 points**

## API Endpoints Reference

### Public Endpoints (No Auth)
- `GET /api/leaderboard/monthly?limit=10` - Monthly leaderboard
- `GET /api/leaderboard/lifetime?limit=10` - Lifetime leaderboard
- `GET /api/leaderboard/full` - Complete leaderboard
- `GET /api/leaderboard/top-three` - Top 3 users

### Protected Endpoints (Require Auth)
- `GET /api/leaderboard/user/stats` - Your personal stats
- `GET /api/leaderboard/user/context?type=monthly&range=2` - You with neighbors

### Debug Endpoints (For Testing)
- `POST /api/debug/populate-leaderboard` - Populate from users
- `GET /api/debug/leaderboard-stats` - View stats
- `POST /api/debug/recalculate-leaderboard` - Manual recalculate
- `POST /api/debug/reset-monthly-leaderboard` - Manual monthly reset

## Success Indicators

✅ You know the system is working when:

1. **Frontend shows ranked users** with badges and points
2. **Your stats appear** in the "Your Performance" section
3. **Real-time updates** - Create transaction → See points increase
4. **Badges appear** for top 3/10 users
5. **Monthly tab differs** from Lifetime tab
6. **Dark mode works** - Toggle and leaderboard stays functional
7. **Responsive design** - Works on mobile/tablet/desktop

## Next Steps

Once testing is complete:

1. **Deploy to production** - Backend and Frontend
2. **Monitor leaderboard updates** - Watch for new point entries
3. **Share with users** - Let them know about the leaderboard
4. **Gather feedback** - Users compete and earn points
5. **Adjust point values** if needed - Rebalance points if system feels unfair
6. **Consider features**:
   - Leaderboard reset frequency
   - Social sharing of rankings
   - Achievement store
   - Streaks and combos

## Performance Notes

- **Leaderboard calculation**: O(n log n) where n = number of users
- **Typical calculation time**: < 1 second for 1000 users
- **Monthly reset**: Runs at 1st month 00:05 AM UTC
- **Database indexes**: Created on monthlyPoints, lifetimePoints for fast sorting

## Support

For issues:
1. Check backend logs in `/logs` directory
2. Review MongoDB connection status
3. Verify user authentication tokens
4. Check if cron jobs are running
5. Test endpoints manually with cURL/Postman
