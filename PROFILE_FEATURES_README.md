# Profile Management System

## Overview

The Profile Management System provides users with comprehensive control over their account information, including personal details editing and secure password management. This feature is accessible through the Profile page in the BachatBuddy application.

## Features

### 1. Edit Profile
- **Personal Information Management**: Users can update their name, email, phone number, location, and bio
- **Real-time Validation**: Form validation ensures data integrity
- **Secure Updates**: All changes are validated and saved securely to the database
- **User Experience**: Seamless editing experience with loading states and error handling

### 2. Change Password
- **Secure Authentication**: Validates current password before allowing changes
- **Password Requirements**: Enforces minimum 6-character password length
- **Confirmation Matching**: Ensures new password confirmation matches
- **Google OAuth Support**: Handles users with Google authentication appropriately
- **Error Handling**: Comprehensive error messages for various scenarios

## API Endpoints

### Backend Routes (`/routes/authRoutes.js`)

```javascript
// Protected routes (require authentication)
router.get('/profile', protect, authController.getProfile);           // GET user profile
router.put('/profile', protect, authController.updateProfile);        // Update profile info
router.put('/change-password', protect, authController.changePassword); // Change password
```

### API Request/Response Examples

#### Get Profile
```javascript
GET /api/auth/profile
Authorization: Bearer <token>

Response:
{
  "status": "success",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "New York, USA",
      "bio": "Software developer passionate about finance",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

#### Update Profile
```javascript
PUT /api/auth/profile
Authorization: Bearer <token>

Body:
{
  "name": "John Smith",
  "phone": "+1987654321",
  "location": "Los Angeles, USA",
  "bio": "Updated bio information"
}

Response:
{
  "status": "success",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1987654321",
      "location": "Los Angeles, USA",
      "bio": "Updated bio information",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

#### Change Password
```javascript
PUT /api/auth/change-password
Authorization: Bearer <token>

Body:
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}

Response:
{
  "status": "success",
  "message": "Password changed successfully"
}
```

## Frontend Components

### Profile Page (`/src/pages/Profile.jsx`)

#### State Management
```javascript
const [isEditing, setIsEditing] = useState(false);           // Edit mode toggle
const [editedUser, setEditedUser] = useState({});           // Form data state
const [isSaving, setIsSaving] = useState(false);            // Loading state
const [showPasswordModal, setShowPasswordModal] = useState(false); // Password modal
const [passwordData, setPasswordData] = useState({...});    // Password form data
const [passwordErrors, setPasswordErrors] = useState({});   // Validation errors
```

#### Key Functions

**Edit Profile Functions:**
- `handleSaveProfile()` - Saves profile changes
- `handleCancelEdit()` - Cancels edit mode
- `handleInputChange()` - Updates form fields

**Password Change Functions:**
- `handlePasswordChange()` - Processes password update
- `validatePasswordForm()` - Validates password requirements
- `handlePasswordInputChange()` - Updates password form fields

## Usage Instructions

### For Users

#### Editing Profile:
1. Navigate to Profile page
2. Click "Edit" button in Personal Information section
3. Modify desired fields (name, email, phone, location, bio)
4. Click "Save" to confirm changes
5. Changes are immediately reflected across the application

#### Changing Password:
1. Go to Profile page → Security tab
2. Click "Change" button in Change Password section
3. Enter current password
4. Enter new password (minimum 6 characters)
5. Confirm new password
6. Click "Change Password" to complete

### For Developers

#### Adding New Profile Fields:
1. **Backend**: Add field to User model in `/models/User.js`
2. **Backend**: Update controller methods to handle new field
3. **Frontend**: Add field to form in Profile.jsx
4. **Database**: Run migration script to add field to existing users

#### Password Security Notes:
- Passwords are hashed using bcrypt with salt rounds of 10
- Current password verification before allowing changes
- Google OAuth users cannot change passwords (handled gracefully)
- All password operations require authentication

## Error Handling

### Common Error Scenarios

#### Profile Update Errors:
- **Email already exists**: When trying to use an email that's already registered
- **Validation errors**: Invalid email format, required fields missing
- **Network errors**: Connection issues during save

#### Password Change Errors:
- **Current password incorrect**: Wrong current password entered
- **Password too short**: New password doesn't meet minimum requirements
- **Passwords don't match**: Confirmation password doesn't match new password
- **Google OAuth restriction**: Attempting to change password for OAuth account

### Error Messages
- All errors are displayed to users with clear, actionable messages
- Form validation provides real-time feedback
- Network errors show retry options

## Security Considerations

1. **Password Security**:
   - bcrypt hashing with salt
   - Current password verification
   - No plaintext password storage

2. **Input Validation**:
   - Server-side validation for all inputs
   - Email format validation
   - SQL injection prevention

3. **Authentication**:
   - JWT token required for all operations
   - Protected routes middleware
   - User session management

## Testing

### Manual Testing Checklist

#### Edit Profile:
- [ ] Edit name and verify it updates
- [ ] Edit email and verify it updates (if changed)
- [ ] Edit phone, location, bio and verify updates
- [ ] Test form validation (required fields, email format)
- [ ] Test cancel functionality

#### Change Password:
- [ ] Change password with correct current password
- [ ] Verify new password requirements (6+ characters)
- [ ] Test password confirmation matching
- [ ] Test with incorrect current password
- [ ] Test with Google OAuth account (should show appropriate message)

### Automated Testing
Consider adding unit tests for:
- Password validation functions
- API endpoint responses
- Form submission handling
- Error state management

## Future Enhancements

### Potential Improvements:
1. **Password Strength Indicator**: Visual feedback for password strength
2. **Two-Factor Authentication**: Additional security layer
3. **Profile Picture Upload**: Image management functionality
4. **Email Verification**: Confirm email changes
5. **Password Reset**: Forgot password functionality

### Accessibility:
- Screen reader support for form labels
- Keyboard navigation for modals
- High contrast mode support
- Error announcement for screen readers

---

*This documentation covers the Profile Management System implementation in BachatBuddy. For questions or issues, please refer to the main project documentation or contact the development team.*
