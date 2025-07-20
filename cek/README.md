# CleanEarth - Aplikasi Pengelolaan Dokumentasi Lingkungan

## Deskripsi
CleanEarth adalah aplikasi web untuk mengelola dokumentasi kegiatan lingkungan dan aksi nyata dalam menjaga bumi.

## Struktur Proyek
```
cek/
├── backend/          # Backend API (Node.js + Express)
├── bruh/            # Frontend (HTML, CSS, JavaScript)
└── Cleanearth/      # Alternatif frontend
```

## Cara Menjalankan Aplikasi

### 1. Backend (API Server)
```bash
cd backend
npm install
npm start
```
Server akan berjalan di `http://localhost:5000`

### 2. Frontend
Buka file `bruh/index.html` di browser atau gunakan server lokal seperti:
- Live Server (VS Code extension)
- XAMPP/Laragon
- Python: `python -m http.server 8000`

## Fitur yang Tersedia

### Admin Panel
- Dashboard Admin (`bruh/dashboard_admin.html`)
- Kelola Dokumentasi (`bruh/dokumentasi_admin.html`)
- CRUD Dokumentasi
- Autentikasi dan otorisasi

### User Panel
- Dashboard User (`bruh/dashboard_user.html`)
- Lihat dokumentasi
- Pendaftaran event

### Public Pages
- Homepage (`bruh/index.html`)
- Dokumentasi publik (`bruh/dokumentasi.html`)
- Login (`bruh/login.html`)
- Register (`bruh/register.html`)

## API Endpoints

### Auth
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user

### Dokumentasi
- `GET /api/dokumentasi` - Ambil semua dokumentasi
- `POST /api/dokumentasi` - Tambah dokumentasi
- `PATCH /api/dokumentasi/:id` - Update dokumentasi
- `DELETE /api/dokumentasi/:id` - Hapus dokumentasi

### User
- `GET /api/user/profile` - Ambil profil user
- `PATCH /api/user/profile` - Update profil user

## Troubleshooting

### Error 404
1. Pastikan backend server berjalan di port 5000
2. Periksa file `.htaccess` untuk routing
3. Gunakan server lokal untuk frontend

### CORS Error
1. Backend sudah dikonfigurasi dengan CORS
2. Pastikan URL API benar (`http://localhost:5000`)

### Database
Aplikasi menggunakan SQLite dengan Sequelize ORM

## Teknologi yang Digunakan
- **Backend**: Node.js, Express, Sequelize, SQLite
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Authentication**: JWT (JSON Web Token)
- **File Upload**: Multer 