# JWT Authentication System - React + NestJS

Ứng dụng web full-stack triển khai JWT authentication với Access Token và Refresh Token, sử dụng React, Axios, React Query, React Hook Form và NestJS backend.

**Sinh viên thực hiện:** Lê Thành Công - MSSV: 23120222

**URL sản phẩm:** [https://frontend-simple-fullstack.vercel.app](https://frontend-simple-fullstack.vercel.app)

**Base URL Backend:** https://backend-simple-fullstack.onrender.com

**Repository:** https://github.com/ltchcmus/basic-user-fullstack

## Tính Năng Chính

### Authentication Flow

- **Login & Logout**: Đăng nhập với email/password, đăng xuất xóa tokens
- **Access Token (5 phút)**: Lưu trong memory (useRef), dùng cho mọi API request
- **Refresh Token (30 phút)**: Lưu trong HTTP-only cookie, tự động làm mới access token
- **Token Auto-Refresh**: Axios interceptor tự động refresh khi access token hết hạn
- **Protected Routes**: Chỉ cho phép truy cập khi có token hợp lệ

### Technical Stack

- **Frontend**: React 19, Material UI, Axios, React Query 5, React Hook Form 7
- **Backend**: NestJS 11, TypeORM, PostgreSQL, JWT
- **State Management**: React Context API + React Query
- **Form Validation**: React Hook Form với real-time validation
- **HTTP Client**: Axios với request/response interceptors

## Yêu Cầu Hệ Thống

### Biến Môi Trường

#### Backend Environment Variables (`.env`)

Tạo file `backend/.env` với nội dung:

```env
# Server Configuration
PORT=9999
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Database Configuration (PostgreSQL)
DB_TYPE=postgres
DB_HOST=your-database-host          # Ví dụ: localhost hoặc cloud DB host
DB_PORT=5432                         # Default PostgreSQL port (hoặc 6543 cho Supabase)
DB_USER=your-database-username
DB_PASS=your-database-password
DB_NAME=your-database-name

# API Key (Bảo mật middleware)
API_KEY=your_secure_api_key_here     # Tạo string ngẫu nhiên dài

# JWT Configuration
JWT_SECRET=your_jwt_secret_key       # Secret cho Access Token
JWT_REFRESH_SECRET=your_jwt_refresh_secret  # Secret cho Refresh Token (phải khác JWT_SECRET)
JWT_EXPIRES_IN=5m                    # Access token hết hạn sau 5 phút
JWT_REFRESH_EXPIRES_IN=30m           # Refresh token hết hạn sau 30 phút
```

**Lưu ý quan trọng:**

- `JWT_SECRET` và `JWT_REFRESH_SECRET` **phải khác nhau**
- `API_KEY` phải **giống hệt** với `VITE_X_API_KEY` trong frontend
- Đối với production, sử dụng values phức tạp và bảo mật

#### Frontend Environment Variables (`.env`)

Tạo file `frontend/.env` với nội dung:

```env
# Backend API URL
VITE_API_URL=http://localhost:9999

# API Key (PHẢI GIỐNG VỚI backend API_KEY)
VITE_X_API_KEY=your_secure_api_key_here
```

**Lưu ý:**

- `VITE_X_API_KEY` **phải giống hệt** `API_KEY` trong backend/.env
- Vite variables phải bắt đầu với `VITE_` prefix

### Cài Đặt Cơ Bản

**Yêu cầu:**

- Node.js 18+
- npm 9+
- PostgreSQL 14+ (hoặc sử dụng cloud database như Supabase)

**Hoặc dùng Docker:**

- Docker Desktop (bao gồm Docker Compose)

## Cài Đặt & Thiết Lập

### Cách 1: Chạy Với Docker (Đơn Giản Nhất - Khuyến Nghị)

```bash
# 1. Clone project và di chuyển vào thư mục
cd Jwt

# 2. Tạo file environment variables cho backend và frontend
# Xem mục "Biến Môi Trường" ở trên để biết cấu hình chi tiết

# 3. Khởi động tất cả services
docker-compose up -d
```

**Các services sẽ chạy tại:**

- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:9999
- 🗄️ **PostgreSQL**: localhost:5432

**Dừng project:**

```bash
docker-compose down -v  # Dừng và xóa tất cả data
```

---

### Cách 2: Chạy Thủ Công (Phát Triển)

#### Bước 1: Chuẩn bị Database

**Option A: Sử dụng PostgreSQL Local**

```bash
# Cài đặt PostgreSQL 14+
# Tạo database mới
createdb your-database-name
```

**Option B: Sử dụng Cloud Database (Supabase, Railway, etc.)**

Lấy connection string từ provider và cập nhật vào `backend/.env`

#### Bước 2: Setup Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env (xem mục "Biến Môi Trường")
# Cập nhật DB_HOST, DB_USER, DB_PASS, JWT secrets, API_KEY

# Chạy migrations để tạo database schema
npm run migration:run

# Khởi động dev server với hot-reload
npm run start:dev
```

✅ Backend sẽ chạy tại: **http://localhost:9999**

#### Bước 3: Setup Frontend

Mở **terminal mới** (giữ backend đang chạy):

```bash
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env (xem mục "Biến Môi Trường")
# VITE_X_API_KEY phải giống backend API_KEY

# Khởi động dev server
npm run dev
```

✅ Frontend sẽ chạy tại: **http://localhost:5173**

---

### Lưu Ý Quan Trọng

**⚠️ Trước khi chạy:**

1. **API Key**: `VITE_X_API_KEY` (frontend) = `API_KEY` (backend)
2. **JWT Secrets**: `JWT_SECRET` ≠ `JWT_REFRESH_SECRET`
3. **Database**: Đảm bảo PostgreSQL đang chạy và database đã được tạo
4. **Migrations**: Chạy `npm run migration:run` trong backend để tạo schema

**🔍 Kiểm tra kết nối:**

- Backend health: http://localhost:9999
- Frontend: http://localhost:5173 (hoặc 3000 nếu dùng Docker)

---## Tính Năng Chính

### 🔐 JWT Authentication System

**Access Token + Refresh Token Flow:**

- **Access Token**: Thời gian sống 5 phút, lưu trong memory (useRef)
- **Refresh Token**: Thời gian sống 30 phút, lưu trong HTTP-only cookie
- **Auto-refresh**: Tự động làm mới token khi hết hạn bằng Axios interceptors
- **Multi-tab sync**: Đồng bộ trạng thái đăng nhập qua localStorage events

### 🛡️ Security Features

- **Manual JWT Verification**: Xác thực token thủ công với fallback logic
- **User ID Validation**: Kiểm tra userId trong token khớp với request
- **Cookie Security**: HTTP-only cookies với secure flags
- **API Key Middleware**: Bảo vệ tất cả endpoints với x-api-key header
- **Password Hashing**: Bcrypt với salt rounds

### 📡 API Endpoints

| Method | Endpoint    | Description                             | Auth Required |
| ------ | ----------- | --------------------------------------- | ------------- |
| POST   | `/register` | Đăng ký tài khoản mới                   | ❌            |
| POST   | `/login`    | Đăng nhập (nhận access + refresh token) | ❌            |
| POST   | `/logout`   | Đăng xuất (xóa refresh token cookie)    | ✅            |
| GET    | `/me`       | Lấy thông tin user hiện tại             | ✅            |
| PATCH  | `/me`       | Cập nhật thông tin user                 | ✅            |

### 🎨 Frontend Features

**Authentication:**

- Protected Routes với redirect tự động
- Public Routes (chặn truy cập khi đã đăng nhập)
- Auto-logout khi token không hợp lệ

**UI/UX:**

- Material UI 7 components
- Inline editing cho profile fields (name, birthOfDay, address)
- Responsive design
- Loading states và error handling
- Stats dashboard với metrics cards

**Form Management:**

- React Hook Form với validation
- Real-time error messages
- Password confirmation với custom validator

**State Management:**

- React Query cho server state (caching, invalidation)
- AuthContext cho global auth state
- useRef cho access token (tránh re-renders)

---

## Kiến Trúc Kỹ Thuật

### Backend Stack

- **Framework**: NestJS 11
- **ORM**: TypeORM 0.3
- **Database**: PostgreSQL 14+ (Supabase hoặc local)
- **Authentication**: @nestjs/jwt + bcrypt
- **Validation**: class-validator, class-transformer

### Frontend Stack

- **Library**: React 19
- **Routing**: React Router 7
- **HTTP Client**: Axios với interceptors
- **Server State**: React Query 5 (TanStack Query)
- **Forms**: React Hook Form 7
- **UI Framework**: Material UI 7
- **Build Tool**: Vite

### JWT Implementation Details

**Token Generation (Backend):**

```typescript
// Access token: 5 phút, chứa userId + username
const accessToken = this.jwtService.sign(
  { userId, username },
  { secret: JWT_SECRET, expiresIn: "5m" }
);

// Refresh token: 30 phút, chỉ chứa userId
const refreshToken = this.jwtService.sign(
  { userId },
  { secret: JWT_REFRESH_SECRET, expiresIn: "30m" }
);
```

**Token Verification (Backend):**

```typescript
// Manual verification với fallback
try {
  payload = this.jwtService.verify(accessToken, { secret: JWT_SECRET });
} catch {
  // Access token hết hạn → dùng refresh token
  payload = this.jwtService.verify(refreshToken, {
    secret: JWT_REFRESH_SECRET,
  });
}

// Validate userId
if (payload.userId !== requestedUserId) {
  throw new UnauthorizedException();
}
```

**Axios Interceptors (Frontend):**

```javascript
// Request: Attach access token
api.interceptors.request.use((config) => {
  const token = accessTokenRef.current;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["x-api-key"] = API_KEY;
  return config;
});

// Response: Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Gọi /me để refresh token
      const { data } = await api.get("/me");
      accessTokenRef.current = data.accessToken;

      // Retry request với token mới
      error.config.headers.Authorization = `Bearer ${data.accessToken}`;
      return api.request(error.config);
    }
    throw error;
  }
);
```

---

## Sử Dụng Ứng Dụng

### 1. Đăng Ký Tài Khoản

1. Truy cập http://localhost:5173/signup
2. Nhập thông tin:
   - Username (bắt buộc)
   - Password (bắt buộc, ≥6 ký tự)
   - Confirm Password (phải khớp với password)
   - Name, Birth of Day, Address (tùy chọn)
3. Click **Sign Up**
4. Tự động chuyển hướng đến trang đăng nhập

### 2. Đăng Nhập

1. Truy cập http://localhost:5173/login
2. Nhập username và password
3. Click **Login**
4. **Access token** được lưu trong memory (useRef)
5. **Refresh token** được lưu trong HTTP-only cookie
6. Chuyển hướng đến Dashboard

### 3. Dashboard - Quản Lý Profile

**Xem thông tin:**

- User info card hiển thị: Name, Username, Birth of Day, Address
- Stats cards: Security, Uptime, Speed, Storage

**Chỉnh sửa thông tin:**

1. Click icon ✏️ bên cạnh field muốn sửa (Name, Birth of Day, Address)
2. Field chuyển sang edit mode
3. Nhập thông tin mới
4. Click icon ✅ để lưu hoặc ❌ để hủy
5. Dữ liệu tự động cập nhật qua React Query

### 4. Đăng Xuất

1. Click nút **Logout** trong Dashboard
2. Refresh token cookie bị xóa
3. Access token bị xóa khỏi memory
4. Chuyển hướng về trang Login

---

## Các Commands Hữu Ích

### Backend Commands

```bash
# Development mode với hot-reload
npm run start:dev

# Production build
npm run build
npm run start:prod

# Run tests
npm run test
npm run test:e2e
npm run test:cov

# TypeORM migrations
npm run migration:generate -- src/migrations/migration-name
npm run migration:run
npm run migration:revert

# Linting và formatting
npm run lint
npm run format
```

### Frontend Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

---

## Testing

### Kiểm Tra JWT Flow

**Test Access Token Expiration:**

1. Đăng nhập
2. Đợi 5 phút (access token hết hạn)
3. Thực hiện action bất kỳ (edit profile)
4. ✅ Token tự động refresh, request thành công

**Test Refresh Token Expiration:**

1. Đăng nhập
2. Đợi 30 phút (refresh token hết hạn)
3. Thực hiện action bất kỳ
4. ✅ Tự động logout, redirect về login

**Test Multi-tab Sync:**

1. Mở 2 tabs cùng 1 browser
2. Đăng nhập ở tab 1
3. ✅ Tab 2 tự động update trạng thái đăng nhập
4. Đăng xuất ở tab 2
5. ✅ Tab 1 tự động logout

---

## Troubleshooting

### Lỗi Kết Nối Database

**Triệu chứng:** Backend không khởi động, lỗi `connection refused`

**Giải pháp:**

```bash
# Kiểm tra PostgreSQL đang chạy
# Windows:
Get-Service postgresql*

# Kiểm tra database đã tồn tại
psql -U postgres -c "\l"

# Verify credentials trong backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your-password
DB_NAME=your-database
```

### Lỗi 401 Unauthorized

**Triệu chứng:** Tất cả requests bị reject với 401

**Giải pháp:**

```bash
# 1. Kiểm tra API_KEY khớp nhau
# backend/.env
API_KEY=your_key_here

# frontend/.env
VITE_X_API_KEY=your_key_here  # PHẢI GIỐNG BACKEND

# 2. Kiểm tra JWT secrets khác nhau
JWT_SECRET=secret1
JWT_REFRESH_SECRET=secret2  # PHẢI KHÁC JWT_SECRET

# 3. Clear browser cookies và localStorage
# DevTools → Application → Clear site data
```

### Lỗi Migration

**Triệu chứng:** `npm run migration:run` thất bại

**Giải pháp:**

```bash
# Xóa tất cả tables trong database
# Xóa file migrations trong src/migrations/

# Tạo migration mới
npm run migration:generate -- src/migrations/init

# Run lại migration
npm run migration:run
```

### Lỗi CORS

**Triệu chứng:** Frontend không gọi được Backend API

**Giải pháp:**

```typescript
// backend/src/main.ts - Kiểm tra CORS config
app.enableCors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true,
});
```

---

## Deployment

### Backend Deployment (Railway/Render)

1. Push code lên GitHub
2. Connect repository với hosting platform
3. Thêm environment variables:
   - Tất cả variables trong `backend/.env`
   - `DATABASE_URL` (connection string từ managed database)
4. Build command: `cd backend && npm install && npm run build`
5. Start command: `cd backend && npm run start:prod`

### Frontend Deployment (Vercel)

1. Push code lên GitHub
2. Import project vào Vercel
3. Build settings:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment variables:
   - `VITE_API_URL`: Backend production URL
   - `VITE_X_API_KEY`: Production API key

**Lưu ý:**

- Update `FRONTEND_URL` trong backend/.env thành production frontend URL
- Sử dụng HTTPS cho production
- Set `secure: true` cho cookies trong production

---

## Thông Tin Thêm

### Project Structure

```
backend/
├── src/
│   ├── user/              # User module (controller, service, DTOs)
│   ├── entity/            # TypeORM entities
│   ├── exception/         # Custom exception filters
│   ├── decorator/         # Custom validators
│   ├── api-key/           # API key middleware
│   ├── migrations/        # Database migrations
│   └── main.ts            # Application entry point
└── .env                   # Environment variables

frontend/
├── src/
│   ├── pages/             # Page components (Login, SignUp, Dashboard)
│   ├── components/        # Reusable components (ProtectedRoute, PublicRoute)
│   ├── context/           # React Context (AuthContext)
│   ├── services/          # API client (Axios instance)
│   └── hooks/             # Custom hooks (useAuth)
└── .env                   # Environment variables
```

### License

MIT

### Tác Giả

Lê Thanh Công

---npm run dev

````

### Lưu Ý Khi Thay Đổi Database

- **Xóa migration cũ**: File trong `backend/src/migrations/` cần được xóa trước khi tạo migration mới
- **API Key phải khớp**: `VITE_API_KEY` (frontend) = `API_KEY` (backend)
- **Port phải trống**: Port 9999 (backend) và 5173 (frontend) không được sử dụng bởi ứng dụng khác
- **PostgreSQL phải chạy**: Đảm bảo PostgreSQL service đang hoạt động

## Các Scripts Có Sẵn

### Docker Commands

```bash
# Khởi động tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down

# Rebuild và khởi động
docker-compose up -d --build

# Xóa tất cả (kể cả data)
docker-compose down -v
````

### Backend

```bash
npm run start:dev    # Khởi động development server với hot reload
npm run build        # Build cho production
npm run start        # Khởi động production server
npm run migration:run    # Chạy database migrations
npm run migration:revert # Hoàn tác migration gần nhất
```

### Frontend

```bash
npm run dev          # Khởi động development server
npm run build        # Build cho production
npm run preview      # Xem trước production build
npm run lint         # Chạy ESLint
```

## API Endpoints

### Xác Thực

- **POST** `/api/v1/users/register` - Đăng ký người dùng mới

  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```

- **POST** `/api/v1/users/login` - Đăng nhập người dùng
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

Tất cả requests yêu cầu header `x-api-key` với API key của bạn.
