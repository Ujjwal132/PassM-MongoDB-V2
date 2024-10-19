# Password Manager MongoDB v2

A secure and user-friendly password manager built with **React**, **Node.js**, **MongoDB**, and **JWT authentication**. The application allows users to register, log in, and manage their passwords in an encrypted format, ensuring privacy and security. Each user has access only to their own saved passwords.

## Features

- **User Authentication**: Registration and login with secure password hashing using `bcrypt` and JWT-based authentication.
- **Password Encryption**: Passwords are stored securely using `AES-256-CBC` encryption.
- **Password Management**:
  - Add, view, update, and delete passwords.
  - Each user can only access their own saved passwords.
- **Token-based Access**: JWT tokens are used to authenticate users and protect sensitive routes.
- **Responsive UI**: User interface built with **React** for a smooth and dynamic experience.
- **Security Features**:
  - Tokens expire after a set duration (e.g., 1 hour), requiring the user to re-login.
  - Strong password enforcement during user registration.
  
## Technologies Used

### Frontend
- **React**: JavaScript library for building user interfaces.
- **React Router**: For routing between pages.
- **TailwindCSS**: Custom styling for the user interface.

### Backend
- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Web framework for Node.js to create RESTful APIs.
- **MongoDB**: NoSQL database to store user data and encrypted passwords.
- **JWT (JSON Web Tokens)**: For user authentication.
- **Bcrypt**: For password hashing and security.
- **AES-256-CBC**: Encryption algorithm used to securely store passwords.

## Installation

### Prerequisites
Make sure you have the following installed:
- **Node.js**: [Download Node.js](https://nodejs.org/)
- **MongoDB**: [Download MongoDB](https://www.mongodb.com/)

### Steps to Run the Project Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/password-manager.git
   cd password-manager
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the backend of the project directory and add the following environment variables:

   ```
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ENCRYPTION_KEY=<32-byte-hexadecimal-key>
   DB_NAME=passwordManager
   ```

   Replace the values with your own MongoDB URI, JWT secret, and a 32-byte hex key for encryption.

3. **Install Backend Dependencies**
   In the project root directory:
   ```bash
   npm install
   ```

4. **Run the Backend**
   Start the server:
   ```bash
   npm start
   ```
   The backend will be running on `http://localhost:3000`.

5. **Install Frontend Dependencies**
   Navigate to the frontend directory (if separate):
   ```bash
   cd client
   npm install
   ```

6. **Run the Frontend**
   Start the React application:
   ```bash
   npm start
   ```
   The frontend will be running on `http://localhost:3001`.

### Folder Structure

```bash
password-manager/
│
├── backend/                # Server-side code (Node.js & Express)
│   ├── server.js           # Main server file
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
│
├── client/                 # Client-side code (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForm.jsx       # Login and Registration form
│   │   │   ├── PasswordManager.jsx# Main password manager component
│   │   └── App.js           # Main app entry point
│   └── package.json         # Frontend dependencies
│
├── README.md                # Project documentation
├── .gitignore               # Git ignore file
└── package.json             # Root package.json (if both front and backend are merged)
```

## API Endpoints

### Authentication

- **POST /register** - Register a new user
  - Request Body: `{ "username": "example", "email": "example@email.com", "password": "your_password" }`
  - Response: `{ "message": "User registered successfully!" }`

- **POST /login** - Login user and get JWT token
  - Request Body: `{ "username": "example", "password": "your_password" }`
  - Response: `{ "token": "your_jwt_token" }`

### Password Management

- **GET /passwords** - Get all saved passwords for the authenticated user
  - Headers: `Authorization: Bearer <token>`
  - Response: An array of saved passwords with decrypted details.

- **POST /passwords** - Save a new password
  - Headers: `Authorization: Bearer <token>`
  - Request Body: `{ "platform": "example", "password": "your_password" }`
  - Response: `{ "success": true, "result": { ... } }`

- **PUT /passwords/:id** - Update a saved password
  - Headers: `Authorization: Bearer <token>`
  - Request Body: `{ "platform": "updated_platform", "password": "updated_password" }`
  - Response: `{ "success": true, "message": "Password updated successfully!" }`

- **DELETE /passwords/:id** - Delete a password
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ "success": true, "message": "Password deleted successfully!" }`

## Security Features

- **Password Encryption**: All user passwords are encrypted using `AES-256-CBC` before being stored in the database.
- **JWT Authentication**: Tokens are issued upon login, ensuring only authenticated users can access the system.
- **Bcrypt Hashing**: User passwords are hashed before saving them to the database, adding an extra layer of security.

## Possible Improvements

- **Two-Factor Authentication (2FA)**: Add an extra layer of security with 2FA during login.
- **Password Expiry Notifications**: Notify users when certain passwords are about to expire and recommend password updates.
- **Search Functionality**: Allow users to search for saved passwords by platform or tag.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
