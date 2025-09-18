# BachatBuddy - Personal Finance Manager

A comprehensive personal finance management application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### 🏠 Landing Page & User Experience
- **Professional Landing Page** with comprehensive sections
- **Hero Section** with animated branding and call-to-action buttons
- **Features Showcase** highlighting 6 key capabilities
- **About Us Section** with company mission and statistics
- **Team Section** with developer profiles and social links
- **Customer Reviews** with authentic testimonials
- **Functional Contact Form** with backend integration and database storage
- **Comprehensive Footer** with social links and newsletter signup
- **Smooth Navigation Flow** from landing to authentication

### 🔐 Core Finance Features
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

### Contact Form
- POST /api/contact - Submit contact form (public)
- GET /api/contact - Get all contact submissions (admin)
- GET /api/contact/:id - Get single contact submission (admin)
- PUT /api/contact/:id - Update contact status/notes (admin)
- DELETE /api/contact/:id - Delete contact submission (admin)
- GET /api/contact/stats/summary - Get contact statistics (admin)

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

---





## Recent Updates & Enhancements

### 🎨 UI/UX Modernization (Latest Updates)

#### ✨ 3D Animated Error/Info Messages
- **3D Animated Notifications**: Implemented stunning 3D animated message system for wallet deletion restrictions
- **Smart Message Routing**: Different visual styles for errors vs. informational messages
- **Interactive Elements**: 
  - Floating 3D icons with glow effects
  - Animated sparkles and particles
  - 3D text shadows and gradient effects
  - Interactive close buttons with hover animations
- **Custom CSS Animations**: Added `slideInLeft`, `float3D`, `glow3D`, `sparkle`, and `wiggle` animations

#### 🔒 Enhanced Wallet Security System
- **12-Hour Creation Protection**: Wallets cannot be deleted within 12 hours of creation
- **24-Hour Transaction Protection**: Wallets with recent transactions (within 24 hours) cannot be deleted
- **Smart Error Handling**: 
  - Blue informational messages for policy restrictions
  - Red error messages for actual system errors
  - Clear, user-friendly messaging explaining wait times

#### 💳 Wallet Management Improvements
- **Simplified Wallet Creation**: Removed opening balance complexity from UI
- **Current Balance Focus**: Dashboard and wallet cards now show only current balance
- **Cleaner Design**: Removed balance change indicators and opening balance displays
- **Modern Form Design**: Updated wallet creation/editing forms with better styling

#### 🎯 Authentication & Forms
- **Icon Removal**: Cleaned up login/signup forms by removing input field icons
- **Better Spacing**: Improved input field layouts and spacing
- **Demo Account Removal**: Removed demo account display from login page for cleaner appearance

#### 📊 Transaction & Budget Pages
- **Modern Transaction Page**: 
  - Beautiful stats cards showing income, expenses, and net flow
  - Enhanced transaction table with icons and better visual hierarchy
  - Improved filters section with emoji icons
  - Professional pagination with numbered buttons
- **Enhanced Budget Page**:
  - Comprehensive stats dashboard with budget health indicators
  - Modern progress bars with color-coded status
  - Improved budget creation forms
  - Better visual feedback for budget tracking

#### 🎨 Visual Design System
- **Consistent Styling**: Applied modern card designs across all pages
- **Gradient Elements**: Added beautiful gradient backgrounds and text effects
- **Animation System**: Implemented fade-in animations and smooth transitions
- **Dark Mode Support**: Enhanced dark mode compatibility across all new components
- **Responsive Design**: Ensured all new components work perfectly on mobile devices

### 🛠️ Technical Improvements

#### Backend Enhancements
- **Time-Based Wallet Deletion**: Implemented sophisticated deletion logic with multiple time checks
- **Error Message Standardization**: Improved error responses with clear, actionable messages
- **Security Enhancements**: Added multiple layers of protection for wallet operations

#### Frontend Architecture
- **State Management**: Enhanced state handling for different message types
- **Component Optimization**: Improved component structure and reusability
- **Animation Performance**: Optimized CSS animations for smooth performance
- **Accessibility**: Maintained accessibility standards while adding visual enhancements

### 🎪 User Experience Highlights
- **Professional Appearance**: App now has premium, modern look and feel
- **Engaging Interactions**: 3D animations make the app feel alive and responsive
- **Clear Communication**: Users always understand what's happening and why
- **Reduced Friction**: Simplified workflows while maintaining functionality
- **Visual Feedback**: Every action provides appropriate visual response

### 📱 Mobile & Responsive Updates
- **Touch-Friendly**: All new interactive elements optimized for mobile
- **Responsive Animations**: Animations scale appropriately across devices
- **Performance Optimized**: Smooth animations even on lower-end devices

### 📊 Advanced Dashboard Analytics (Latest Enhancement)

#### ✨ Premium Chart Visualizations
- **Enhanced DonutChart Component**:
  - Gradient-filled pie segments with smooth animations
  - Custom tooltips with progress bars and detailed breakdowns
  - Center text display showing total expenses
  - Professional empty states with helpful messaging
  - Increased chart size (320px height) for better visibility

- **Advanced BarChart Component**:
  - Gradient bar fills (blue for budget, red for spent)
  - Smart tooltips showing budget usage percentages
  - Color-coded progress indicators (green/yellow/red based on usage)
  - Rounded bar corners and clean axis styling
  - Enhanced empty state with call-to-action messaging

- **Modern LineChart Component**:
  - Thicker lines (3px) with gradient stroke colors
  - Enhanced dots with white borders and larger active states
  - Advanced tooltips calculating net flow automatically
  - Better date formatting with localized short names
  - Staggered animations for visual appeal

#### 🎨 Dashboard Container Enhancements
- **Glassmorphism Design**: Backdrop blur effects with semi-transparent containers
- **Gradient Backgrounds**: Theme-specific color schemes for each chart section
- **Animated Particles**: Floating background elements with staggered animations
- **3D Floating Icons**: Custom animated icons with shadow effects and hover states
- **Professional Headers**: Gradient text titles with descriptive subtitles

#### 🎪 Interactive Features
- **Smart Tooltips**: Glassmorphism design with detailed calculations and progress bars
- **Live Data Indicators**: Pulsing animations showing real-time data status
- **Enhanced Empty States**: Beautiful placeholder designs with helpful guidance
- **Responsive Animations**: Smooth transitions and hover effects throughout

#### 📈 Chart-Specific Improvements
- **Expenses by Category**: Purple/Pink gradient theme with center total display
- **Budget vs Spent**: Blue/Indigo theme with usage percentage calculations
- **Income vs Expense Trend**: Emerald/Teal theme with net flow analysis

### 🔧 Transaction Stats Enhancement
- **Separate Data Management**: Fixed stats calculation to show ALL transactions, not just paginated results
- **Dual Fetch Strategy**: Paginated data for table display, complete data for statistics
- **Real-time Updates**: Stats automatically refresh when creating/deleting transactions
- **Smart Filtering**: Statistics reflect the same filtered data as the transaction table

These updates transform BachatBuddy from a functional finance app into a **premium, engaging, and visually stunning** personal finance management experience with **enterprise-grade analytics** and **professional chart visualizations**! 🚀

### 🌟 Landing Page Implementation (Latest Feature)

#### ✨ Comprehensive Landing Page Experience
- **Professional First Impression**: Complete landing page serving as the entry point for all visitors
- **Modern Design System**: Consistent with existing app aesthetics using gradients, animations, and glassmorphism
- **Conversion Optimized**: Strategic placement of call-to-action buttons to drive user registration

#### 🎯 Landing Page Sections

##### 1. Hero Section
- **Animated Branding**: Large BachatBuddy logo with floating 3D effects
- **Compelling Headlines**: "Your Smart Financial Companion for Better Money Management"
- **Dual CTAs**: "Get Started Free" (→ signup) and "Sign In" (→ login) buttons
- **Background Animation**: Beautiful blob animations with gradient colors
- **Responsive Design**: Optimized for all screen sizes

##### 2. Features Showcase
- **6 Key Features**: Multi-Wallet Management, Smart Analytics, Budget Planning, Recurring Transactions, Mobile Responsive, Secure & Private
- **Interactive Cards**: Hover effects with wiggle animations on icons
- **Professional Icons**: Emoji-based icons with consistent styling
- **Staggered Animations**: Cards appear with fade-in effects and animation delays

##### 3. About Us Section
- **Company Story**: Mission statement and founding information
- **Statistics Display**: User count, uptime, and founding year with colored indicators
- **Mission Card**: Gradient background card highlighting company mission
- **Two-Column Layout**: Text content paired with visual mission statement

##### 4. Why Choose BachatBuddy
- **4 Differentiators**: Easy to Use, Lightning Fast, Beautiful Design, Smart Insights
- **Feature Cards**: Large icons with detailed descriptions
- **Horizontal Layout**: Two-column grid for better readability
- **Hover Interactions**: Card elevation effects on hover

##### 5. Customer Reviews
- **4 Authentic Testimonials**: From Engineer, Business Owner, Student, and Freelancer
- **Star Ratings**: 5-star visual ratings for each review
- **User Avatars**: Gradient circular avatars with initials
- **Professional Layout**: Grid layout with consistent card styling

##### 6. Contact Us Section
- **Contact Information**: Email, phone, and address details with icons
- **Contact Form**: Full-featured form with validation styling
- **Interactive Elements**: Gradient icon containers and modern input fields
- **Two-Column Layout**: Contact info alongside contact form

##### 7. Call-to-Action Section
- **Conversion Focus**: Final opportunity to drive signups
- **Gradient Background**: Eye-catching blue-to-purple gradient
- **Dual Buttons**: Primary "Start Your Journey" and secondary "Welcome Back"
- **Social Proof**: "Join thousands of users" messaging

##### 8. Comprehensive Footer
- **Brand Section**: Logo, description, and social media links
- **Link Categories**: Product, Company, Support, and Legal sections
- **Newsletter Signup**: Email subscription with gradient button
- **Back-to-Top**: Floating button for easy navigation
- **Status Indicator**: "All systems operational" with animated dot

#### 🔧 Technical Implementation

##### Frontend Architecture
- **New Components**: 
  - `Landing.jsx` - Main landing page component
  - `Footer.jsx` - Reusable footer component
- **Enhanced Routing**: Updated `App.jsx` with new routing structure
- **Protected Routes**: Proper authentication flow with route protection
- **Layout System**: Flexible layout component for different page types

##### Routing Structure
```javascript
/ (Landing Page) - Public route, first page visitors see
/login - Public authentication route
/signup - Public registration route
/dashboard - Protected route (requires authentication)
/wallets - Protected route
/transactions - Protected route
/budgets - Protected route
```

##### CSS Enhancements
- **Blob Animations**: Added `@keyframes blob` with transform and scale effects
- **Animation Delays**: Staggered animation timing for visual appeal
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Performance**: Optimized animations for smooth performance

##### Navigation Flow
1. **Landing Page** (`/`) - Default route for all visitors
2. **Get Started** → Signup page (`/signup`)
3. **Sign In** → Login page (`/login`)
4. **After Authentication** → Dashboard (`/dashboard`)
5. **Protected Routes** - Automatic redirect to login if not authenticated

#### 🎨 Design Features
- **Consistent Branding**: Maintains BachatBuddy's visual identity
- **Modern Animations**: Fade-in, slide-in, blob, and wiggle effects
- **Glassmorphism**: Backdrop blur effects and semi-transparent elements
- **Gradient System**: Consistent color schemes throughout
- **Dark Mode Support**: Full compatibility with existing theme system
- **Mobile Optimization**: Touch-friendly interactions and responsive layouts

#### 📈 Business Impact
- **Professional Credibility**: Establishes trust with potential users
- **Feature Communication**: Clearly explains app capabilities and benefits
- **Social Proof**: Customer testimonials build confidence
- **Lead Generation**: Contact form captures potential user inquiries
- **Conversion Optimization**: Strategic CTAs drive user registration

This landing page implementation transforms BachatBuddy into a **complete web application** with a professional marketing presence, providing an excellent first impression and smooth onboarding experience for new users! 🎉

### 📧 Contact Form System Implementation (Latest Feature)

#### ✨ Functional Contact Form Integration
- **Backend Database Storage**: Contact form submissions are now saved to MongoDB
- **Real-time Form Validation**: Client-side and server-side validation for all fields
- **Professional User Experience**: Loading states, success messages, and error handling
- **Admin Management System**: Complete CRUD operations for contact submissions

#### 🗄️ Database Schema & Models
- **Contact Model**: Comprehensive schema with validation and status tracking
- **Field Validation**: Email format validation, required fields, character limits
- **Status Management**: new → read → replied → resolved workflow
- **Admin Notes**: Internal notes system for contact management

#### 🔧 Backend API Implementation
- **Public Endpoint**: `POST /api/contact` for form submissions
- **Admin Endpoints**: Full CRUD operations for contact management
- **Pagination Support**: Efficient handling of large contact lists
- **Statistics API**: Dashboard metrics for contact submissions
- **Status Tracking**: Automated read status and manual status updates

#### 🎨 Frontend Integration
- **Functional Form**: Real contact form with state management
- **Loading States**: Visual feedback during form submission
- **Success/Error Messages**: User-friendly feedback system
- **Form Reset**: Automatic form clearing after successful submission
- **Responsive Design**: Mobile-optimized contact form layout

#### 📊 Contact Management Features
- **Status Tracking**: new, read, replied, resolved statuses
- **Admin Dashboard**: View all contact submissions with filtering
- **Pagination**: Efficient browsing of contact history
- **Search & Filter**: Find contacts by status, date, or content
- **Statistics**: Contact metrics and analytics for admins

#### 🔒 Security & Validation
- **Input Sanitization**: All form inputs are validated and sanitized
- **Rate Limiting**: Protection against spam submissions
- **Admin Authentication**: Secure access to contact management features
- **Data Privacy**: Secure storage and handling of user contact information

This contact form system provides a complete solution for user inquiries, from initial submission to final resolution, with professional admin management capabilities! 📬
