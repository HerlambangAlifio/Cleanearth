# 🌱 CleanEarth - Platform Manajemen Event Lingkungan

CleanEarth adalah platform web untuk manajemen event lingkungan yang memungkinkan organisasi mengelola event eco-friendly dan peserta mendapatkan sertifikat partisipasi.

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Teknologi](#-teknologi)
- [Instalasi](#-instalasi)
- [Database Setup](#-database-setup)
- [Penggunaan](#-penggunaan)
- [API Documentation](#-api-documentation)
- [Struktur Proyek](#-struktur-proyek)
- [Contributing](#-contributing)

## ✨ Fitur

### 👥 User Management
- **Registration & Login** dengan JWT authentication
- **Role-based Access Control** (Admin & User)
- **Profile Management** dengan foto profil
- **Edit Profile** dengan validasi

### 🎯 Event Management
- **CRUD Event** (Admin)
- **Event Registration** (User)
- **Event Status**: upcoming, ongoing, completed, cancelled
- **Event Categories** dengan gambar dan deskripsi
- **Event Approval System**

### 🏆 Sertifikat System
- **Upload Sertifikat** (Admin)
- **Download Sertifikat** (User)
- **Sertifikat Validation** (mencegah duplicate)
- **File Support**: JPG, PNG, PDF

### 📸 Dokumentasi
- **Upload Dokumentasi** kegiatan
- **Gallery Dokumentasi**
- **File Management**

### 💡 Tips & Trik
- **Content Management** untuk tips
- **CRUD Operations**

### 📊 Laporan
- **Sistem Pelaporan**
- **Admin Dashboard** dengan statistik

## 🛠 Teknologi

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM untuk database
- **MySQL/PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling (Grid, Flexbox, Animations)
- **Vanilla JavaScript** - Interactivity
- **SVG Icons** - UI elements

## 🚀 Instalasi

### Prerequisites
- Node.js (v14 atau lebih baru)
- MySQL/PostgreSQL
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd cek
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (jika ada)
cd ../Client
npm install # (jika menggunakan package manager)
```

### 3. Environment Setup
Buat file `.env` di folder `backend`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=cleanearth_db
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 4. Database Setup
```bash
# Import database schema
mysql -u root -p cleanearth_db < database/cleanearth.sql
```

### 5. Start Server
```bash
# Start backend server
cd backend
npm start

# Server akan berjalan di http://localhost:5000
```

### 6. Access Application
- **Frontend**: Buka `Client/index.html` di browser
- **Backend API**: http://localhost:5000

## 🗄 Database Setup

### 1. Buat Database
```sql
CREATE DATABASE cleanearth_db;
USE cleanearth_db;
```

### 2. Import Schema
File SQL lengkap tersedia di `database/cleanearth.sql`

### 3. Struktur Tabel
- `users` - Data pengguna
- `events` - Data event
- `event_registrations` - Pendaftaran event
- `sertifikat` - Sertifikat user
- `dokumentasi` - Dokumentasi kegiatan
- `tips` - Tips & trik
- `laporan` - Sistem laporan

## 📖 Penggunaan

### 👤 User (Peserta Event)
1. **Register/Login** di halaman utama
2. **Dashboard** - Lihat statistik dan sertifikat
3. **Event** - Lihat event tersedia dan daftar
4. **Event Saya** - Lihat event yang diikuti
5. **Profile** - Kelola data profil
6. **Sertifikat** - Download sertifikat event

### 👨‍💼 Admin
1. **Login** dengan akun admin
2. **Dashboard Admin** - Kelola semua data
3. **Event Management** - CRUD event
4. **User Management** - Kelola user
5. **Sertifikat Management** - Upload sertifikat
6. **Dokumentasi** - Upload dokumentasi
7. **Tips & Trik** - Kelola konten tips

## 🔌 API Documentation

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
```

### Events
```http
GET /api/event/public          # List event publik
GET /api/event/mine            # Event user (protected)
GET /api/event/:id             # Detail event
POST /api/event/:id/join       # Join event (protected)
```

### User
```http
GET /api/user/me               # Profile user (protected)
PATCH /api/user/:id            # Update profile (protected)
```

### Sertifikat
```http
GET /api/sertifikat/user       # User sertifikat (protected)
GET /api/sertifikat/public     # List sertifikat publik
```

### Admin Endpoints (Protected)
```http
# Events
POST /api/event                # Create event
PATCH /api/event/:id           # Update event
DELETE /api/event/:id          # Delete event

# Users
GET /api/user                  # List users
PATCH /api/user/:id            # Update user
DELETE /api/user/:id           # Delete user

# Sertifikat
POST /api/sertifikat           # Upload sertifikat
PATCH /api/sertifikat/:id      # Update sertifikat
DELETE /api/sertifikat/:id     # Delete sertifikat
```

## 📁 Struktur Proyek

```
cek/
├── backend/
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth & validation
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── uploads/              # File storage
│   ├── db.js                 # Database connection
│   └── server.js             # Main server file
├── Client/
│   ├── assets/               # Images & static files
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript files
│   ├── *.html                # HTML pages
│   └── index.html            # Main page
├── database/
│   └── cleanearth.sql        # Database schema & data
├── README.md                 # This file
└── package.json              # Project dependencies
```

## 🔧 Development

### Running in Development Mode
```bash
# Backend dengan nodemon (auto-restart)
cd backend
npm run dev

# Frontend - Live server atau buka file HTML langsung
```

### File Upload Configuration
- **Upload Directory**: `backend/uploads/`
- **Supported Formats**: JPG, PNG, PDF
- **Max File Size**: 5MB
- **File Naming**: Timestamp + original name

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=cleanearth_db
DB_PORT=3306

# JWT
JWT_SECRET=your_secret_key

# Server
PORT=5000
NODE_ENV=development
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Pastikan MySQL/PostgreSQL berjalan
   - Cek credentials di `.env`
   - Pastikan database `cleanearth_db` sudah dibuat

2. **File Upload Error**
   - Pastikan folder `backend/uploads/` ada
   - Cek permission folder
   - Pastikan file size tidak melebihi limit

3. **CORS Error**
   - Pastikan CORS middleware sudah dikonfigurasi
   - Cek origin URL di browser

4. **JWT Token Error**
   - Pastikan `JWT_SECRET` sudah diset
   - Cek token expiration

### Logs
```bash
# Backend logs
cd backend
npm start

# Database logs
mysql -u root -p -e "SHOW PROCESSLIST;"
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Support

Jika ada pertanyaan atau masalah:
- Buat issue di repository
- Email: support@cleanearth.com
- Dokumentasi lengkap: [Wiki](wiki-url)

---

**CleanEarth** - Membuat dunia lebih hijau, satu event pada satu waktu! 🌱✨ 