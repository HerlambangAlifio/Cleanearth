require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const pendaftaranRoutes = require('./routes/pendaftaran');
const dokumentasiRoutes = require('./routes/dokumentasi');
const tipsRoutes = require('./routes/tips');
const sertifikatRoutes = require('./routes/sertifikat');
const laporanRoutes = require('./routes/laporan');
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');

app.use('/api/auth', authRoutes);
app.use('/api/pendaftaran', pendaftaranRoutes);
app.use('/api/dokumentasi', dokumentasiRoutes);
app.use('/api/tips', tipsRoutes);
app.use('/api/sertifikat', sertifikatRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/user', userRoutes);
app.use('/api/event', eventRoutes);
app.use('/uploads', express.static('uploads'));

// Sinkronisasi Sequelize dan jalankan server
sequelize.sync()
  .then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log(err)); 