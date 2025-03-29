<h1 align="center">Neo LinkedIn - A Modern Professional Network 🚀</h1>

<p align="center">
  <img src="linkedin-clone.gif" alt="Neo LinkedIn Demo" width="800">
</p>

## About Neo LinkedIn

Neo LinkedIn is a modern, feature-rich professional networking platform built with the MERN stack (MongoDB, Express, React, Node.js). This project implements best practices in web development including code quality tools, error handling, security features, and performance optimizations.

### Key Features

-   🔒 Secure Authentication System with JWT
-   👤 Comprehensive User Profiles
-   🔄 News Feed with Posts and Interactions
-   💬 Real-time Comments and Likes
-   🤝 Connection Management System
-   📧 Email Notifications for Important Events
-   🖼️ Image Upload for Posts and Profiles
-   👥 Suggested Users Feature
-   🛡️ Enhanced Security Features
-   ⚡ Optimized Performance with Database Indexing

## Technical Implementation

### 🧰 Technology Stack

- **Frontend**: React, Tailwind CSS, DaisyUI, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary
- **Email Service**: Mailtrap
- **Code Quality**: ESLint, Prettier

### ✨ Code Quality & Best Practices

- **Service Layer Architecture** for better code organization
- **Centralized Error Handling** for consistent error responses
- **Rate Limiting** to prevent API abuse
- **Security Headers** with Helmet.js
- **Database Indexing** for optimized queries

### 🔧 Setup Instructions

1. Clone the repository
2. Set up environment variables in `.env` file

```bash
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=<your_mongo_uri>

# Authentication
JWT_SECRET=<your_jwt_secret>

# External Services
MAILTRAP_TOKEN=<your_mailtrap_token>
EMAIL_FROM=<your_email>
EMAIL_FROM_NAME=<your_name>

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

# Frontend URL
CLIENT_URL=http://localhost:5173
```

## Installation

### Backend

```bash
# Navigate to project root
cd its-neo-linkedin

# Install backend dependencies
npm install

# Create MongoDB indexes for performance
npm run create-indexes
```

### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install
```

## Running the Application

```bash
# Run both frontend and backend concurrently
npm run dev:all

# Or run them separately
npm run dev           # Backend only
npm run dev:frontend  # Frontend only

# For production
npm run build         # Build the application
npm run start         # Start production server
```

Access the application at http://localhost:5173 in your browser.

## Code Quality

```bash
# Run linting
npm run lint

# Format code
npm run format
```

## Project Structure

- `/backend` - Express server and API
  - `/controllers` - Request handlers
  - `/models` - MongoDB schema models
  - `/middleware` - Express middleware
  - `/services` - Business logic layer
  - `/lib` - Utility functions and setup

- `/frontend` - React application
  - `/src/components` - Reusable UI components
  - `/src/pages` - Application pages
  - `/src/hooks` - Custom React hooks
  - `/src/lib` - Utility functions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
