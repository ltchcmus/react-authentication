# JWT Authentication System - React + NestJS

A complete full-stack application implementing secure JWT authentication with access tokens and refresh tokens. Built with React, NestJS, TypeORM, PostgreSQL, and deployed on Vercel/Render.

**Author:** Lê Thành Công

**Live Application:** [https://frontend-simple-fullstack.vercel.app](https://frontend-simple-fullstack.vercel.app)

**Backend API:** https://backend-simple-fullstack.onrender.com

**GitHub Repository:** https://github.com/ltchcmus/basic-user-fullstack

## ✨ Features

### Authentication & Security

- ✅ **JWT Access Tokens** - Short-lived tokens stored in memory for API requests
- ✅ **JWT Refresh Tokens** - Long-lived tokens stored in HTTP-only cookies
- ✅ **Automatic Token Refresh** - Seamless token renewal when access token expires
- ✅ **Secure Cookie Storage** - Refresh tokens stored in HTTP-only, secure cookies
- ✅ **Token Invalidation** - Proper logout with server-side token cleanup
- ✅ **Protected Routes** - Client-side route protection using React Router
- ✅ **Password Hashing** - Bcrypt password encryption
- ✅ **JWT Strategy** - Passport.js JWT validation

### User Interface

- ✅ **Material UI Design** - Modern, responsive UI components
- ✅ **React Hook Form** - Form validation with real-time feedback
- ✅ **React Query** - Server state management and caching
- ✅ **Protected Dashboard** - User profile with real-time data fetching
- ✅ **Profile Updates** - Edit name and bio with React Query mutations
- ✅ **Multi-tab Logout Sync** - Logout reflects across all browser tabs
- ✅ **Loading States** - Proper loading indicators during async operations

### Backend

- ✅ **NestJS Framework** - Scalable Node.js backend
- ✅ **TypeORM** - Database ORM with migrations
- ✅ **PostgreSQL** - Production-ready database
- ✅ **API Key Middleware** - Additional security layer
- ✅ **Global Exception Filters** - Centralized error handling
- ✅ **Role-Based Fields** - User roles support for future RBAC

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **React Router 7** - Client-side routing
- **React Hook Form 7** - Form validation
- **React Query (TanStack Query) 5** - Server state management
- **Axios** - HTTP client with interceptors
- **Material UI 7** - Component library
- **Vite** - Build tool

### Backend

- **NestJS 11** - Backend framework
- **TypeORM 0.3** - Database ORM
- **PostgreSQL** - Database
- **Passport JWT** - Authentication strategy
- **Bcrypt** - Password hashing
- **Cookie Parser** - Cookie handling

### Deployment

- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Docker** - Containerization (optional)

## 📋 Requirements

### Using Docker (Recommended)

- Docker Desktop (latest version)
- Docker Compose (included in Docker Desktop)

### Manual Setup

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (v14 or higher)

## 🚀 Installation & Setup

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/ltchcmus/basic-user-fullstack.git
cd basic-user-fullstack

# Start all services
docker-compose up -d
```

Access:

- Frontend: http://localhost:3000
- Backend: http://localhost:9999
- Database: localhost:5432

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend
npm install

# Configure .env file (see Configuration section)

# Run migrations
npm run migration:run

# Start backend
npm run start:dev
```

#### Frontend Setup

```bash
cd frontend
npm install

# Configure .env file (see Configuration section)

# Start frontend
npm run dev
```

## ⚙️ Configuration

### Backend Environment Variables (`.env`)

```env
# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=jwt_auth_db

# Server Configuration
PORT=9999
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Security
API_KEY=your_secure_api_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=7d
```

### Frontend Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:9999
VITE_X_API_KEY=your_secure_api_key_here
```

**Important:** `VITE_X_API_KEY` must match `API_KEY` in backend.

## 🔐 Authentication Flow

### Login Process

1. User submits email/password via React Hook Form
2. Backend validates credentials and generates:
   - Access token (15min, signed with `JWT_SECRET`)
   - Refresh token (7 days, signed with `JWT_REFRESH_SECRET`)
3. Refresh token hash stored in database
4. Refresh token sent as HTTP-only cookie
5. Access token returned in response and stored in memory
6. User redirected to dashboard

### Token Refresh Flow

1. Axios interceptor detects 401 Unauthorized
2. Automatically calls `/users/refresh` with cookie
3. Backend validates refresh token against stored hash
4. New access token issued and stored in memory
5. Original request retried with new token
6. If refresh fails, user logged out automatically

### Logout Process

1. User clicks logout button
2. Frontend calls `/users/logout` endpoint
3. Backend clears refresh token hash in database
4. Cookie cleared from browser
5. Access token removed from memory
6. `authEvent` dispatched to sync logout across tabs
7. User redirected to login page

### Multi-Tab Sync

1. Logout triggers `localStorage.setItem('authEvent', ...)`
2. Other tabs listen to `storage` event
3. All tabs clear user state and redirect to login
4. Works for both login and logout actions

## 📡 API Endpoints

### Public Endpoints

#### Register

```
POST /api/v1/users/register
Headers: x-api-key: your_api_key

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "name": "John Doe",          // optional
  "role": "user"                // optional
}
```

#### Login

```
POST /api/v1/users/login
Headers: x-api-key: your_api_key

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "code": 200,
  "message": "User logged in successfully",
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "accessToken": "jwt_token",
    "createdAt": "2024-12-04T10:00:00Z"
  }
}

Cookies: refreshToken (HTTP-only, secure)
```

#### Refresh Token

```
POST /api/v1/users/refresh
Cookies: refreshToken (sent automatically)

Response:
{
  "code": 200,
  "message": "Token refreshed",
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

#### Logout

```
POST /api/v1/users/logout
Cookies: refreshToken (sent automatically)

Response:
{
  "code": 200,
  "message": "Logged out"
}
```

### Protected Endpoints (Require Access Token)

#### Get Current User

```
GET /api/v1/users/me
Headers: Authorization: Bearer {accessToken}

Response:
{
  "code": 200,
  "message": "OK",
  "data": {
    "user": {
      "userId": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "bio": "User biography",
      "createdAt": "2024-12-04T10:00:00Z"
    }
  }
}
```

#### Update Profile

```
PATCH /api/v1/users/me
Headers: Authorization: Bearer {accessToken}

Body:
{
  "name": "Jane Doe",
  "bio": "Software Engineer"
}

Response:
{
  "code": 200,
  "message": "Profile updated",
  "data": {
    "user": {
      "userId": "uuid",
      "email": "user@example.com",
      "name": "Jane Doe",
      "role": "user",
      "bio": "Software Engineer",
      "createdAt": "2024-12-04T10:00:00Z"
    }
  }
}
```

## 🎯 Key Implementation Details

### Axios Interceptor (Token Refresh)

```javascript
// Request interceptor - attach access token
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor - refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { data } = await api.post("/api/v1/users/refresh");
      setAccessToken(data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

### React Query Integration

```javascript
// Fetch user profile
const { data: serverUser } = useQuery({
  queryKey: ["me"],
  queryFn: getMe,
  retry: 1,
});

// Update profile mutation
const updateMutation = useMutation({
  mutationFn: updateProfile,
  onSuccess: (data) => {
    queryClient.invalidateQueries(["me"]);
    setAuthUser(data.user);
  },
});
```

### Multi-Tab Sync

```javascript
useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === "authEvent" && e.newValue) {
      const event = JSON.parse(e.newValue);
      if (event.type === "logout") {
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  };
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);
```

## 📦 Scripts

### Docker

```bash
docker-compose up -d          # Start all services
docker-compose logs -f        # View logs
docker-compose down           # Stop services
docker-compose down -v        # Stop and remove volumes
```

### Backend

```bash
npm run start:dev             # Development mode
npm run build                 # Build for production
npm run start:prod            # Production mode
npm run migration:generate    # Generate migration
npm run migration:run         # Run migrations
npm run migration:revert      # Revert last migration
```

### Frontend

```bash
npm run dev                   # Development server
npm run build                 # Production build
npm run preview               # Preview production build
```

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   VITE_X_API_KEY=your_api_key
   ```
4. Deploy

### Backend (Render)

1. Create new Web Service
2. Connect GitHub repository
3. Configure:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm run start:prod`
4. Add environment variables (all from backend `.env`)
5. Deploy

## 📝 Assignment Compliance

### ✅ Requirements Met

1. **Authentication Flow** ✓

   - Login/logout implemented
   - Access + refresh tokens
   - Access token in memory
   - Refresh token in HTTP-only cookies

2. **Token Management** ✓

   - Access token in memory (15min)
   - Refresh token in secure cookies (7 days)
   - All tokens cleared on logout

3. **Axios Configuration** ✓

   - Request interceptor attaches access token
   - Response interceptor handles 401
   - Automatic token refresh
   - Logout on refresh failure

4. **React Query Integration** ✓

   - `useMutation` for login/logout
   - `useQuery` for protected data
   - Query invalidation on auth changes

5. **React Hook Form Integration** ✓

   - Login form with validation
   - Error messages displayed
   - Integration with React Query mutation

6. **Protected Routes** ✓

   - `ProtectedRoute` component
   - Redirect to login if unauthenticated

7. **User Interface** ✓

   - Login page with React Hook Form
   - Dashboard with user info
   - Logout button
   - Profile update feature

8. **Public Hosting** ✓

   - Deployed to Vercel (frontend)
   - Deployed to Render (backend)
   - Public URL in README

9. **Error Handling** ✓
   - Login errors displayed
   - Token expiration handled
   - Network errors handled

### ✅ Optional Features Implemented

1. **Silent Token Refresh** ✓

   - Automatic refresh before expiration via interceptor

2. **Cookie Storage** ✓

   - Refresh tokens in HTTP-only cookies instead of localStorage

3. **Multi-Tab Sync** ✓

   - Logout syncs across all tabs using `storage` event

4. **Role-Based Fields** ✓
   - User entity includes `role` field for future RBAC

## 🔒 Security Best Practices

- ✅ Access tokens stored in memory (not localStorage)
- ✅ Refresh tokens in HTTP-only cookies
- ✅ Refresh token hashed in database
- ✅ Password hashing with bcrypt
- ✅ API key middleware
- ✅ CORS configuration
- ✅ Secure cookies in production
- ✅ Token expiration times
- ✅ Proper logout flow

## 📄 License

MIT

## 👤 Author

**Lê Thành Công**

- GitHub: [@ltchcmus](https://github.com/ltchcmus)
- Project: [basic-user-fullstack](https://github.com/ltchcmus/basic-user-fullstack)
