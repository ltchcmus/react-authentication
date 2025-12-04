# JWT Authentication System - React + NestJS

Ứng dụng web full-stack triển khai JWT authentication với Access Token và Refresh Token, sử dụng React, Axios, React Query, React Hook Form và NestJS backend.

**Sinh viên thực hiện:** Lê Thành Công - MSSV: 23120222

**URL sản phẩm:** https://react-authentication-plum.vercel.app

**Base URL Backend:** https://react-authentication-0xsg.onrender.com

**Repository:** https://github.com/ltchcmus/react-authentication

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

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:9999

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

** Trước khi chạy:**

1. **API Key**: `VITE_X_API_KEY` (frontend) = `API_KEY` (backend)
2. **JWT Secrets**: `JWT_SECRET` ≠ `JWT_REFRESH_SECRET`
3. **Database**: Đảm bảo PostgreSQL đang chạy và database đã được tạo
4. **Migrations**: Chạy `npm run migration:run` trong backend để tạo schema

**Kiểm tra kết nối:**

- Backend health: http://localhost:9999
- Frontend: http://localhost:5173 (hoặc 3000 nếu dùng Docker)

---
