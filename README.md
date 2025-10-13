# Course Management API 

## 1) Chuẩn bị
- Node.js >= 20
- Docker Desktop (Compose v2)
- Nest CLI (cài khi `npm i` hoặc `npm i -g @nestjs/cli@^11`)

## 2) Chạy hạ tầng
```bash
docker compose up -d
```

## 3) Cấu hình
Sửa `.env.development` 

## 4) Cài & chạy
```bash
npm i
npm run start:dev
# mở http://localhost:3000/api-docs
```

## 5) Test
```bash
npm run test
npm run test:e2e
```

## 6) Flow thử nhanh
- POST /users/register (student/instructor/admin)
- POST /auth/login -> lấy accessToken
- GET /courses (public, có cache Redis)
- POST /courses (Instructor/Admin)
- PATCH /courses/:id (Instructor course của mình/Admin)
- DELETE /courses/:id (Instructor course của mình/Admin)
- POST /enrollments/:courseId (Student)
- GET /enrollments/course/:courseId/students (Instructor/Admin)

Khi enroll, xem console sẽ thấy log từ **EventEmitter** và **RabbitMQ consumer** (giả lập “send email”).
