## Important Documentations
[📜 Contribution Guidelines](./contribution-rules.md)


# LearnFlow

A backend API service built with Express.js and Prisma ORM.

## Prerequisites

- Node.js (v16 or newer)
- npm or yarn or pnpm (suggested: pnpm)
- MongoDB (or another database supported by Prisma)

## Setup

1. Clone the repository
   ```bash
   git clone https://github.com/Reactive-accelerator-batch-2/learn-flow-backend.git
   cd learn-flow-backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   
   # Database
   DATABASE_URL="mongodb+srv://username:password@cluster0.wonjk.mongodb.net/learn-flow"
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=90d
   
   # Optional: Logging
   LOG_LEVEL=debug
   ```

4. Set up the database with Prisma
   ```bash
   npx prisma init
   npx prisma db push
   ```

## Running the Application

### Development Mode

Run the application with hot reloading:
```bash
npm run dev
```

### Production Mode

Build and start the application:
```bash
npm run build
npm start
```

## API Documentation

API documentation is available at `/docs` which redirects to:
[https://documenter.getpostman.com/view/26564987/2sAYk7T4Q5](https://documenter.getpostman.com/view/26564987/2sAYk7T4Q5)

## Available Endpoints

- **Health Check**: `GET /health`
- **Authentication**:
  - Register: `POST /api/v1/users/register`
  - Login: `POST /api/v1/users/login`
- **User Management** (Admin only):
  - Get all users: `GET /api/v1/users`
  - Create user: `POST /api/v1/users`
  - Get user by ID: `GET /api/v1/users/:id`
  - Update user: `PUT /api/v1/users/:id`
  - Delete user: `DELETE /api/v1/users/:id`
- **User Profile**:
  - Get profile: `GET /api/v1/users/profile`

## Project Structure

```
learn-flow/
├── src/
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── server.js          # Application entry point
├── prisma/                # Prisma ORM files
├── .env                   # Environment variables
├── .eslintrc.js           # ESLint configuration
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## Scripts

- `npm run dev`: Start the development server with hot reload
- `npm start`: Start the production server
- `npm run lint`: Run ESLint for code quality

## Dependencies

- **express**: Web framework
- **prisma**: ORM for database access
- **@prisma/client**: Prisma client for database queries
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **cors**: Cross-Origin Resource Sharing
- **helmet**: Security headers
- **morgan**: HTTP request logging
- **dotenv**: Environment variables
- **date-fns**: Date utilities
- **zod**: Schema validation

## Development Dependencies

- **nodemon**: Development server with hot reload
- **eslint**: Code linting
- **prettier**: Code formatting
- **eslint-config-prettier**: ESLint and Prettier integration

## License

[MIT](LICENSE)