// Ganti URL API sesuai backend Anda
const API_URL = 'http://localhost:5000/api/user/me';
const token = localStorage.getItem('token');

async function loadProfile() {
  try {
    const res = await fetch(API_URL, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Gagal mengambil data user');
    const data = await res.json();

    // Cek struktur data (langsung atau ada .Profile)
    const user = data.user || data;
    const profile = user.Profile || user.profile || user;

    // Nama, email, role
    document.getElementById('profileName').textContent = user.username || '-';
    document.getElementById('profileEmail').textContent = user.email || '-';
    document.getElementById('profileRole').textContent = user.role || '-';

    // Nama lengkap, alamat, no hp
    document.getElementById('profileNamaLengkap').textContent =
      profile.nama_lengkap || profile.namaLengkap || '-';
    document.getElementById('profileAlamat').textContent =
      profile.alamat || profile.Alamat || '-';
    document.getElementById('profileNoHp').textContent =
      profile.no_hp || profile.noHp || '-';

    // Avatar
    const avatar = document.getElementById('profileAvatar');
    if (profile.foto_profil || profile.fotoProfil) {
      avatar.innerHTML = `<img src="http://localhost:5000/uploads/${profile.foto_profil || profile.fotoProfil}" alt="Profile">`;
    } else {
      avatar.textContent = (user.username || 'U').charAt(0).toUpperCase();
    }
  } catch (err) {
    document.getElementById('profileName').textContent = 'Gagal memuat profil';
    document.getElementById('profileEmail').textContent = '-';
    document.getElementById('profileRole').textContent = '-';
    document.getElementById('profileNamaLengkap').textContent = '-';
    document.getElementById('profileAlamat').textContent = '-';
    document.getElementById('profileNoHp').textContent = '-';
    document.getElementById('profileAvatar').textContent = '!';
  }
}

document.addEventListener('DOMContentLoaded', loadProfile);