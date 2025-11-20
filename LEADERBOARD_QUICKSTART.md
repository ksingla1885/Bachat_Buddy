# Quick Start: Populate Leaderboard with User Data

## Overview

The leaderboard is now fully integrated but needs to be populated with existing user data. You have 3 options to populate it:

---

## Option 1: API Endpoint (Easiest - No Terminal)

### Step 1: Make sure backend is running
```bash
cd backend
npm start
```

### Step 2: Open Postman or use curl to call the populate endpoint

**Using Postman:**
1. Create a new POST request
2. URL: `http://localhost:5001/api/debug/populate-leaderboard`
3. Click "Send"

**Using curl:**
```bash
curl -X POST http://localhost:5001/api/debug/populate-leaderboard
```

**Using browser (simple):**
- Open: `http://localhost:5001/api/debug/leaderboard-stats` (view current stats)

### Response Example:
```json
{
  "status": "success",
  "message": "Leaderboard populated successfully",
  "data": {
    "processedUsers": 5,
    "totalEntries": 5,
    "topUsers": [
      {
        "rank": 1,
        "username": "Mayank",
        "lifetimePoints": 520,
        "badges": ["saver_king"]
      }
    ],
    "statistics": {
      "avg": 104,
      "max": 520,
      "min": 0
    }
  }
}
```

---

## Option 2: Node Script (Direct Database)

### Step 1: Make sure MongoDB is running

### Step 2: Run the script from backend directory
```bash
cd backend
node scripts/populateLeaderboard.js
```

### Output:
```
🚀 Starting leaderboard population...

✅ Connected to MongoDB

📊 Found 5 users

🗑️ Cleared 0 existing leaderboard entries

✅ [1/5] Mayank - 520 points
✅ [2/5] Arjun - 490 points
✅ [3/5] Priya - 450 points
✅ [4/5] Raj - 320 points
✅ [5/5] Deepak - 0 points

✅ Created 5 leaderboard entries

📈 Calculating ranks and assigning badges...

🏆 Top 10 Users (Lifetime Leaderboard):

Rank | Username | Lifetime Points | Badges
-----|----------|-----------------|--------
1    | Mayank   | 520             | saver_king
2    | Arjun    | 490             | top_saver
3    | Priya    | 450             | top_saver
4    | Raj      | 320             | smart_saver
5    | Deepak   | 0               | None

📊 Statistics:
Total Entries: 5
Average Points: 336
Max Points: 520
Min Points: 0

✅ Leaderboard population completed successfully!

🔌 Database connection closed
```

---

## Option 3: API Endpoints for Management

### View Current Leaderboard Stats
```
GET http://localhost:5001/api/debug/leaderboard-stats
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalUsers": 5,
    "totalLeaderboardEntries": 5,
    "usersWithBadges": 3,
    "stats": {
      "totalPoints": 1680,
      "avgPoints": 336,
      "maxPoints": 520,
      "minPoints": 0
    },
    "topUser": {
      "_id": "...",
      "username": "Mayank",
      "lifetimePoints": 520
    },
    "bottomUser": {
      "_id": "...",
      "username": "Deepak",
      "lifetimePoints": 0
    }
  }
}
```

### Recalculate Leaderboard Rankings
```
POST http://localhost:5001/api/debug/recalculate-leaderboard
```

### Reset Monthly Leaderboard (Test 1st of Month Reset)
```
POST http://localhost:5001/api/debug/reset-monthly-leaderboard
```

---

## Checking the Leaderboard

### Step 1: Go to the Leaderboard Page
1. Login to BachatBuddy
2. Click "Achievements" dropdown in navbar
3. Click "Leaderboard"

### Step 2: View Results
You should now see:
- ✅ Your Performance stats
- ✅ Top 10 users with ranks and badges
- ✅ Monthly and Lifetime tabs
- ✅ Badge information

---

## What Gets Populated

### From Each User:
- **Username**: From `User.name`
- **Lifetime Points**: Sum of all points from `PointsLog`
- **Monthly Points**: Set to 0 (fresh start)
- **Rank**: Calculated based on lifetime points
- **Badges**: Automatically assigned based on rank

### Badges Assigned:
| Rank | Badge | Icon |
|------|-------|------|
| #1 | Saver King | 👑 |
| #2-3 | Top Saver | ⭐ |
| #4-10 | Smart Saver | ✨ |

---

## Recommended Steps

1. **Populate Data:**
   ```bash
   curl -X POST http://localhost:5001/api/debug/populate-leaderboard
   ```

2. **Check Stats:**
   ```bash
   curl http://localhost:5001/api/debug/leaderboard-stats
   ```

3. **View in Frontend:**
   - Navigate to Leaderboard page
   - Click through tabs
   - Verify badges and ranks

4. **Test Monthly Reset (Optional):**
   ```bash
   curl -X POST http://localhost:5001/api/debug/reset-monthly-leaderboard
   ```

---

## Troubleshooting

### "No leaderboard data available yet"
- ✅ Run populate endpoint
- ✅ Check if users exist: `GET /api/debug/leaderboard-stats`
- ✅ Verify MongoDB connection

### Badges not showing
- Run recalculate: `POST /api/debug/recalculate-leaderboard`
- Check if points are > 0

### Wrong points
- Verify points in `PointsLog` collection
- Check if users have points from activities

### Can't connect to API
- Ensure backend is running on port 5001
- Check `.env` file has correct MongoDB URI
- Verify no firewall issues

---

## What Happens Next

### Automatic Point Earning:
When users perform activities:
- Stay under budget → +50 points
- Complete goals → +100 points
- Monthly savings → +5 per ₹1000
- Pay debt → +10 per ₹1000

Each activity **automatically updates** the leaderboard!

### Monthly Reset:
Every 1st of month at 00:05 AM:
- Monthly points reset to 0
- Lifetime points stay same
- Ranks recalculated
- Badges updated

---

## Next Steps

1. **Populate leaderboard** (see options above)
2. **View in browser** at `/leaderboard`
3. **Create sample transactions** to earn points
4. **Watch ranks update** in real-time

Enjoy the competition! 🏆
