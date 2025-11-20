# Leaderboard System Documentation

## Overview

The Leaderboard System is a competitive feature that tracks user savings performance through points and ranks. Users earn points from various financial activities and can compete on monthly and lifetime leaderboards.

## Features

### 🏆 Main Features

1. **Monthly Leaderboard** - Top performers reset each month
2. **Lifetime Leaderboard** - All-time achievements
3. **Real-time Rank Calculation** - Updates as users earn points
4. **Badge System** - Recognition for top performers
5. **User Performance Dashboard** - Personal stats and badges
6. **Automatic Monthly Reset** - Cron job runs every 1st of month at 00:05 AM

## Database Schema

### Leaderboard Model

```javascript
{
  userId: ObjectId,          // Reference to User
  username: String,          // User's name
  monthlyPoints: Number,     // Points earned this month (resets)
  lifetimePoints: Number,    // Total points (never resets)
  monthlyRank: Number,       // Calculated rank (1-n)
  lifetimeRank: Number,      // Calculated lifetime rank
  savingsAmount: Number,     // Optional display field
  streak: Number,            // Consecutive days/months active
  badges: [String],          // Array of badge codes
  lastUpdated: Date,         // Last time entry was updated
  lastMonthlyReset: Date,    // Last time monthly points were reset
  createdAt: Date,
  updatedAt: Date
}
```

## Points System

### How Users Earn Points

| Activity | Points | Condition |
|----------|--------|-----------|
| Budget Management | +50 | Stay under budget for category |
| Goal Completion | +100 | Complete a goal |
| Monthly Savings | +5 per ₹1000 | End of month savings calculation |
| Debt Payment | +10 per ₹1000 | Payment made towards debt |

### Point Integration

Points are automatically awarded through:
- `userController.awardBudgetPoints()` - Budget alerts
- `userController.awardGoalCompletionPoints()` - Goal completion
- `userController.awardMonthlySavingsPoints()` - Monthly calculation
- `userController.awardDebtPaymentPoints()` - Debt tracking

All point awards automatically call `LeaderboardService.updateUser()` to update leaderboard.

## Badge System

### Monthly Badges
- **Saver King** 👑 - Rank #1 in monthly leaderboard
- **Top Saver** ⭐ - Rank #2-3 in monthly leaderboard
- **Smart Saver** ✨ - Rank #4-10 in monthly leaderboard

### Lifetime Badges
- **Saver King** 👑 - All-time #1
- **Top Saver** ⭐ - All-time #2-3
- **Smart Saver** ✨ - All-time #4-10

### Badge Assignment Logic

Badges are automatically assigned during rank calculation in `leaderboardService.calculateRanks()`:
- Badges are stored in the `badges` array
- Old badges are removed when ranks change
- Multiple badges can be held simultaneously

## Backend Architecture

### Services

#### `leaderboardService.js`

Main service for leaderboard operations:

```javascript
// Update user's leaderboard entry
await LeaderboardService.updateUser(userId, pointsEarned, reason)

// Recalculate all ranks and assign badges
await LeaderboardService.calculateRanks()

// Get top 10 monthly users
const monthlyBoard = await LeaderboardService.getMonthlyLeaderboard(limit)

// Get top 10 lifetime users
const lifetimeBoard = await LeaderboardService.getLifetimeLeaderboard(limit)

// Get specific user's stats
const stats = await LeaderboardService.getUserStats(userId)

// Monthly reset (cron job)
await LeaderboardService.resetMonthlyPoints()

// Initialize new user
await LeaderboardService.initializeUser(userId, username)

// Get user context with surrounding ranks
const context = await LeaderboardService.getUserRankContext(userId, type, range)
```

### Cron Jobs

#### `leaderboardReset.js`

Runs monthly reset every 1st of month at 00:05 AM:
- Resets all `monthlyPoints` to 0
- Keeps `lifetimePoints` unchanged
- Recalculates ranks and badges
- Optional: Sends congratulatory emails to top 3

### Controllers

#### `leaderboardController.js`

API endpoints:

```
GET  /leaderboard/monthly          - Top 10 monthly
GET  /leaderboard/lifetime         - Top 10 lifetime
GET  /leaderboard/full             - Full leaderboard with pagination
GET  /leaderboard/top-three        - Top 3 users (dashboard widget)
GET  /leaderboard/user/stats       - Logged-in user's stats
GET  /leaderboard/user/context     - User's rank context
POST /leaderboard/recalculate      - Manual rank recalculation
```

## API Endpoints

### Public Endpoints

#### GET `/api/leaderboard/monthly?limit=10`

Returns top monthly leaderboard:

```json
{
  "status": "success",
  "data": [
    {
      "rank": 1,
      "username": "Mayank",
      "monthlyPoints": 520,
      "badges": ["saver_king_monthly"]
    }
  ]
}
```

#### GET `/api/leaderboard/lifetime?limit=10`

Returns top lifetime leaderboard (same format).

#### GET `/api/leaderboard/full?type=monthly&page=1&limit=20`

Paginated leaderboard view.

#### GET `/api/leaderboard/top-three`

Returns top 3 with medal emojis:

```json
{
  "status": "success",
  "data": [
    {
      "position": 1,
      "username": "Mayank",
      "points": 520,
      "badge": "🥇"
    }
  ]
}
```

### Protected Endpoints (JWT Required)

#### GET `/api/leaderboard/user/stats`

Returns logged-in user's performance:

```json
{
  "status": "success",
  "data": {
    "username": "Mayank",
    "monthlyRank": 7,
    "monthlyPoints": 320,
    "lifetimeRank": 5,
    "lifetimePoints": 2150,
    "badges": ["top_saver", "smart_saver_monthly"]
  }
}
```

#### GET `/api/leaderboard/user/context?type=monthly&range=2`

User's rank with surrounding context:

```json
{
  "status": "success",
  "data": {
    "userStats": {
      "username": "Mayank",
      "rank": 7,
      "points": 320
    },
    "context": [
      { "rank": 5, "username": "User5", "points": 350 },
      { "rank": 6, "username": "User6", "points": 335 },
      { "rank": 7, "username": "Mayank", "points": 320 },
      { "rank": 8, "username": "User8", "points": 310 }
    ]
  }
}
```

## Frontend Components

### Leaderboard Page (`Leaderboard.jsx`)

Located at `/src/pages/Leaderboard.jsx`

Features:
- **Two Tabs**: Monthly & Lifetime
- **User Stats Box**: Shows personal rank and points
- **Leaderboard Table**: Ranked list with medals for top 3
- **Badge Display**: Shows earned badges
- **Points Guide**: Shows how to earn points
- **Responsive Design**: Works on mobile and desktop
- **Dark Mode**: Full dark mode support

Navigation: Achievements → Leaderboard (under Crown icon)

### Components Used

- **lucide-react**: For icons (Trophy, Medal, TrendingUp, etc.)
- **Tailwind CSS**: For styling
- **API Service**: For data fetching

## Integration Points

### Points Award Functions Updated

1. **Budget Controller** → `awardBudgetPoints()`
2. **Goal Controller** → `awardGoalCompletionPoints()`
3. **Transaction Controller** → `awardMonthlySavingsPoints()`
4. **Debt Controller** → `awardDebtPaymentPoints()`

Each function now:
- Awards points to user
- Logs the activity
- Calls `LeaderboardService.updateUser()`
- Triggers automatic rank recalculation

## Initialization Flow

### For New Users

When a new user signs up:
1. User created in MongoDB
2. Leaderboard entry initialized (optional - auto-create on first point)
3. Entry set to `monthlyPoints: 0`, `lifetimePoints: 0`

### For Existing Users

When adding this feature to existing users:
```bash
# Run migration script (optional)
npm run migrate:leaderboard
```

## Cron Job Configuration

### Schedule

- **Pattern**: `5 0 1 * * *`
- **Time**: 1st of every month at 00:05 AM UTC
- **Action**: Reset monthly leaderboard

### Manual Trigger

```bash
# Testing in development
POST /api/leaderboard/recalculate
```

## Security

1. **JWT Authentication**: Protected endpoints require valid token
2. **Input Validation**: All inputs sanitized
3. **User Isolation**: Users can only see their own stats
4. **Role-based**: Admin functions protected

## Performance Optimizations

1. **Database Indexes**:
   - `monthlyPoints` (descending)
   - `lifetimePoints` (descending)
   - `userId` (unique)

2. **Lazy Loading**: Leaderboard data loaded on demand
3. **Caching**: Consider Redis for frequently accessed data
4. **Pagination**: Large leaderboards use pagination

## Troubleshooting

### Leaderboard Not Updating

1. Check if `LeaderboardService.updateUser()` is called after points
2. Verify user exists in database
3. Check MongoDB connection
4. Review backend logs

### Ranks Not Calculating

1. Run `POST /api/leaderboard/recalculate` manually
2. Check if cron job is running: `console.log` in server.js
3. Verify Node Cron is installed: `npm install node-cron`

### Badges Not Showing

1. Ensure ranks are calculated
2. Check `badges` array in Leaderboard document
3. Verify `calculateRanks()` is called

## Future Enhancements

1. **Streaks**: Track consecutive days/months of saving
2. **Achievements**: Specific achievement unlocks
3. **Leaderboard Filters**: By category, time period
4. **Social Sharing**: Share achievements on social media
5. **Notifications**: Alert user when rank changes
6. **Email Rewards**: Weekly/monthly email to top performers
7. **Achievements Store**: Redeem points for rewards
8. **Leaderboard Chat**: Community engagement

## Database Migration

If adding to existing database:

```javascript
const Leaderboard = require('./models/Leaderboard');
const User = require('./models/User');

async function migrateExistingUsers() {
  const users = await User.find({});
  
  for (const user of users) {
    await Leaderboard.create({
      userId: user._id,
      username: user.name,
      monthlyPoints: 0,
      lifetimePoints: user.points || 0
    });
  }
  
  console.log(`Migrated ${users.length} users to leaderboard`);
}

// Run: migrateExistingUsers();
```

## Testing

### Manual Testing

1. Create multiple test users
2. Award points through different activities
3. Check leaderboard updates
4. Test rank calculation
5. Verify badge assignment
6. Test monthly reset (advance system time or manually trigger)

### Automated Testing (Optional)

```javascript
// Test points award
const service = require('./services/leaderboardService');
await service.updateUser(userId, 50, 'test');
```

## Dependencies

- `mongoose`: MongoDB ORM
- `node-cron`: Cron job scheduling
- `express`: Backend framework
- `lucide-react`: Icons (frontend)
- `tailwindcss`: Styling (frontend)

## File Structure

```
backend/
├── models/
│   └── Leaderboard.js
├── controllers/
│   └── leaderboardController.js
├── routes/
│   └── leaderboardRoutes.js
├── services/
│   └── leaderboardService.js
├── cronJobs/
│   └── leaderboardReset.js
└── (update userController.js, app.js, server.js)

frontend/
├── pages/
│   └── Leaderboard.jsx
├── config/
│   └── navigation.js (updated)
└── App.jsx (updated)
```

## Support

For issues or questions:
1. Check backend logs: `console.log` statements in service
2. Review database documents: MongoDB Atlas
3. Verify API responses in browser console
4. Check frontend component render in React DevTools
