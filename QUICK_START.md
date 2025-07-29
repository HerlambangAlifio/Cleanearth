# 🚀 CleanEarth Quick Start Guide

## ⚡ Setup Cepat (5 Menit)

### 1. Prerequisites
- ✅ Node.js (v14+)
- ✅ MySQL/PostgreSQL
- ✅ Git

### 2. Clone & Setup
```bash
# Clone repository
git clone <repository-url>
cd cek

# Run setup script
# Windows:
setup.bat

# Linux/Mac:
chmod +x setup.sh
./setup.sh
```

### 3. Database Setup
```sql
# Buat database
CREATE DATABASE cleanearth_db;

# Import schema
mysql -u root -p cleanearth_db < database/cleanearth.sql
```

### 4. Environment Configuration
Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=cleanearth_db
JWT_SECRET=your_secret_key
PORT=5000
```

### 5. Start Application
```bash
# Start backend
cd backend
npm start

# Open frontend
# Buka Client/index.html di browser
```

## 🎯 Default Credentials

### Admin Account
- **Email**: admin@cleanearth.com
- **Password**: admin123
- **Role**: Admin

### Sample User Accounts
- **Email**: john@example.com
- **Password**: password123
- **Role**: User

## 📱 Test the Application

### 1. Login sebagai Admin
- Buka `Client/login.html`
- Login dengan admin credentials
- Akses dashboard admin

### 2. Test Fitur Admin
- ✅ Buat event baru
- ✅ Upload sertifikat
- ✅ Kelola user
- ✅ Upload dokumentasi

### 3. Login sebagai User
- Register user baru atau gunakan sample user
- Test fitur user dashboard
- Lihat sertifikat

## 🔧 Troubleshooting

### Database Connection Error
```bash
# Cek MySQL service
sudo service mysql status

# Cek credentials
mysql -u root -p
```

### Port Already in Use
```bash
# Cek port 5000
netstat -tulpn | grep :5000

# Kill process
kill -9 <PID>
```

### File Upload Error
```bash
# Cek folder uploads
ls -la backend/uploads/

# Set permissions
chmod 755 backend/uploads/
```

## 📊 Sample Data

Setelah import database, Anda akan memiliki:

### Events
- Clean Up Jakarta Bay (Completed)
- Tree Planting Day (Upcoming)
- Recycling Workshop (Upcoming)
- Ocean Conservation Seminar (Completed)

### Users
- 1 Admin account
- 4 Sample user accounts

### Sertifikat
- 8 Sample sertifikat untuk user

### Dokumentasi
- 5 Sample dokumentasi kegiatan

## 🎨 Customization

### Change Theme Colors
Edit `Client/css/style.css`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

### Add New Features
1. Create new model in `backend/models/`
2. Add controller in `backend/controllers/`
3. Create routes in `backend/routes/`
4. Update frontend

## 📞 Need Help?

- 📖 [Full Documentation](README.md)
- 🔌 [API Documentation](API_DOCUMENTATION.md)
- 🐛 [Report Issues](https://github.com/cleanearth/issues)

---

**CleanEarth** - Ready to make the world greener! 🌱✨ 