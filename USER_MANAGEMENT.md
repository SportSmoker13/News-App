# User Management System

This document describes the user management functionality implemented in the MedNews admin panel.

## Overview

The user management system allows administrators to:
- View all users in the system
- Create new users
- Edit existing user information
- Delete users (with safety checks)
- Manage user roles (USER, CLIENT, ADMIN)
- Search and filter users

## Features

### 1. User Dashboard (`/admin/users`)
- **Statistics Cards**: Shows total users, active users, and admin count
- **Search & Filter**: Search by name/email and filter by role
- **User Table**: Displays all users with pagination
- **Quick Actions**: Edit and delete users directly from the table

### 2. User Operations

#### Create User
- Required fields: Name, Email, Password
- Optional: Role selection (defaults to USER)
- Email uniqueness validation
- Password hashing with bcrypt

#### Edit User
- Update name, email, and role
- Optional password change (leave blank to keep current)
- Email uniqueness validation
- Preserves existing data

#### Delete User
- Confirmation dialog
- Safety check: Cannot delete users with articles
- Cannot delete your own account
- Soft validation with helpful error messages

#### Role Management
- Inline role editing with dropdown
- Three roles: USER, CLIENT, ADMIN
- Cannot change your own role
- Immediate role updates

### 3. Security Features

#### Authentication
- Admin-only access to user management
- Server-side authentication checks
- Session validation on all operations

#### Data Protection
- Password hashing with bcrypt
- Email uniqueness enforcement
- Input validation and sanitization
- CSRF protection through NextAuth

#### Safety Checks
- Prevent self-deletion
- Prevent self-role changes
- Prevent deletion of users with articles
- Proper error handling and user feedback

## Technical Implementation

### Files Created/Modified

1. **Server Actions** (`src/lib/actions/user.js`)
   - `getUsers()` - Fetch users with pagination and filtering
   - `createUser()` - Create new user
   - `updateUser()` - Update existing user
   - `deleteUser()` - Delete user with safety checks
   - `updateUserRole()` - Update user role
   - `getUserStats()` - Get user statistics

2. **Components**
   - `UserManagement.jsx` - Main user management interface
   - `select.jsx` - Select dropdown component
   - `dropdown-menu.jsx` - Navigation dropdown

3. **Pages**
   - `/admin/users` - User management page
   - `/admin` - Updated admin dashboard with navigation

4. **Navigation**
   - Updated navbar with admin dropdown menu
   - Direct links to user management

### Database Schema

The system uses the existing User model with:
- `id`: Unique identifier
- `email`: Unique email address
- `password`: Hashed password
- `name`: User's display name
- `role`: Enum (USER, CLIENT, ADMIN)
- `createdAt`/`updatedAt`: Timestamps

### Dependencies Added

- `@radix-ui/react-select` - For select dropdowns
- `@radix-ui/react-dropdown-menu` - For navigation dropdown

## Usage

### For Administrators

1. **Access**: Login as admin and click the "Admin" dropdown in the navbar
2. **Navigate**: Select "Users" from the dropdown menu
3. **Manage**: Use the interface to perform user operations

### User Roles

- **USER**: Basic access to view articles
- **CLIENT**: Can manage articles and view admin features
- **ADMIN**: Full access to all admin features including user management

## Error Handling

The system provides comprehensive error handling:
- Form validation with user-friendly messages
- Server error handling with toast notifications
- Database constraint violations (e.g., duplicate emails)
- Authentication and authorization errors

## Future Enhancements

Potential improvements:
- Bulk user operations
- User activity tracking
- Advanced filtering options
- User import/export functionality
- Audit logs for user changes
- Email verification system
- Password reset functionality

## Security Considerations

- All user operations require admin authentication
- Passwords are properly hashed
- Input validation prevents injection attacks
- Proper error handling prevents information leakage
- Session management through NextAuth
- CSRF protection built-in 