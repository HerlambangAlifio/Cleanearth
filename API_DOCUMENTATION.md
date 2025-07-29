# 🔌 CleanEarth API Documentation

## 📋 Overview

CleanEarth API adalah RESTful API untuk platform manajemen event lingkungan. API ini menggunakan JWT untuk authentication dan mendukung role-based access control.

**Base URL**: `http://localhost:5000/api`

## 🔐 Authentication

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Register
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "nama_lengkap": "New User",
  "alamat": "Jakarta, Indonesia",
  "no_hp": "081234567890"
}
```

## 👥 User Management

### Get User Profile
```http
GET /user/me
Authorization: Bearer <token>
```

### Update User Profile
```http
PATCH /user/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `nama_lengkap` (optional)
- `alamat` (optional)
- `no_hp` (optional)
- `foto` (optional, file)

### Get All Users (Admin Only)
```http
GET /user
Authorization: Bearer <token>
```

## 🎯 Event Management

### Get Public Events
```http
GET /event/public
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status

### Get Event by ID
```http
GET /event/:id
```

### Get User Events
```http
GET /event/mine
Authorization: Bearer <token>
```

### Join Event
```http
POST /event/:id/join
Authorization: Bearer <token>
```

### Create Event (Admin Only)
```http
POST /event
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `judul` (required)
- `deskripsi` (required)
- `tanggal` (required, YYYY-MM-DD)
- `waktu_mulai` (required, HH:MM:SS)
- `waktu_selesai` (required, HH:MM:SS)
- `lokasi` (required)
- `kapasitas` (optional)
- `gambar` (optional, file)

### Update Event (Admin Only)
```http
PATCH /event/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Event (Admin Only)
```http
DELETE /event/:id
Authorization: Bearer <token>
```

## 🏆 Sertifikat Management

### Get User Sertifikat
```http
GET /sertifikat/user
Authorization: Bearer <token>
```

### Get Public Sertifikat
```http
GET /sertifikat/public
```

### Upload Sertifikat (Admin Only)
```http
POST /sertifikat
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `userId` (required): ID user
- `eventId` (optional): ID event
- `gambar` (required, file): File sertifikat

### Update Sertifikat (Admin Only)
```http
PATCH /sertifikat/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Sertifikat (Admin Only)
```http
DELETE /sertifikat/:id
Authorization: Bearer <token>
```

## 📸 Dokumentasi Management

### Get All Dokumentasi
```http
GET /dokumentasi
```

### Get Dokumentasi by ID
```http
GET /dokumentasi/:id
```

### Create Dokumentasi (Admin Only)
```http
POST /dokumentasi
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `judul` (required)
- `deskripsi` (optional)
- `gambar` (required, file)

### Update Dokumentasi (Admin Only)
```http
PATCH /dokumentasi/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Dokumentasi (Admin Only)
```http
DELETE /dokumentasi/:id
Authorization: Bearer <token>
```

## 💡 Tips Management

### Get All Tips
```http
GET /tips
```

### Get Tips by ID
```http
GET /tips/:id
```

### Create Tips (Admin Only)
```http
POST /tips
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `judul` (required)
- `konten` (required)
- `gambar` (optional, file)

### Update Tips (Admin Only)
```http
PATCH /tips/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Tips (Admin Only)
```http
DELETE /tips/:id
Authorization: Bearer <token>
```

## 📊 Laporan Management

### Get All Laporan (Admin Only)
```http
GET /laporan
Authorization: Bearer <token>
```

### Get Laporan by ID (Admin Only)
```http
GET /laporan/:id
Authorization: Bearer <token>
```

### Create Laporan (Admin Only)
```http
POST /laporan
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `judul` (required)
- `deskripsi` (optional)
- `file_laporan` (optional, file)

### Update Laporan (Admin Only)
```http
PATCH /laporan/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Delete Laporan (Admin Only)
```http
DELETE /laporan/:id
Authorization: Bearer <token>
```

## 📝 Event Registration Management

### Get All Registrations (Admin Only)
```http
GET /event/registrations
Authorization: Bearer <token>
```

### Get Registration by ID (Admin Only)
```http
GET /event/registrations/:id
Authorization: Bearer <token>
```

### Update Registration Status (Admin Only)
```http
PATCH /event/registrations/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "approved" // or "rejected"
}
```

## 🔧 Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message",
  "errors": {
    "field": "Error description"
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Token tidak valid atau expired"
}
```

### 403 Forbidden
```json
{
  "message": "Anda tidak memiliki akses ke resource ini"
}
```

### 404 Not Found
```json
{
  "message": "Resource tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "message": "Terjadi kesalahan pada server",
  "error": "Error details"
}
```

## 📁 File Upload

### Supported Formats
- **Images**: JPG, JPEG, PNG
- **Documents**: PDF
- **Max Size**: 5MB

### File Naming
Files are automatically renamed with timestamp: `timestamp-originalname.ext`

### File Access
Uploaded files can be accessed at: `http://localhost:5000/uploads/filename.ext`

## 🔒 Security

### JWT Token
- **Algorithm**: HS256
- **Expiration**: 24 hours
- **Secret**: Configured in environment variables

### CORS
- **Origin**: Configurable in environment
- **Methods**: GET, POST, PATCH, DELETE
- **Headers**: Content-Type, Authorization

### Rate Limiting
- **Requests per minute**: 100
- **Burst**: 200 requests

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

## 🧪 Testing

### Test Endpoints
```bash
# Test server health
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cleanearth.com","password":"admin123"}'
```

### Postman Collection
Import file `CleanEarth_API.postman_collection.json` ke Postman untuk testing lengkap.

## 📞 Support

Untuk bantuan teknis atau pertanyaan tentang API:
- Email: api-support@cleanearth.com
- Documentation: https://docs.cleanearth.com/api
- GitHub Issues: https://github.com/cleanearth/api/issues 