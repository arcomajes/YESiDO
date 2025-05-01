# Wedding Memory Gallery System

## Description
A modern web application for managing and sharing wedding memories. This system allows guests to upload photos and messages for the wedding couple, featuring a beautiful interface with animations and a responsive design. It includes an admin dashboard for managing uploaded content and a public gallery view.

## Technologies Used
- **Frontend**
  - React.js
  - CSS3 with custom animations
  - Axios for API calls
  - React Router for navigation
  - Framer Motion for animations
  - Lucide React for icons

- **Backend**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - Multer for file uploads
  - Bcrypt for password hashing

- **Development Tools**
  - Concurrently for running multiple scripts
  - Nodemon for development
  - Environment variables management with dotenv

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd wedding-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REACT_APP_BACKEND_URL=http://localhost:5001
```

4. Start the development server:
```bash
# Run both frontend and backend
npm run dev

# Run frontend only
npm start

# Run backend only
npm run server
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## Default Admin Login
- Username: Estrell&Kevin
- Password: Kevstrell0613
