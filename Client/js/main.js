// Fungsi untuk decode JWT (tanpa verifikasi, hanya decode payload base64)
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function renderMenu() {
  const token = localStorage.getItem('token');
  const menuDiv = document.getElementById('menu');
  const roleInfo = document.getElementById('roleInfo');
  menuDiv.innerHTML = '';
  roleInfo.innerHTML = '';
  if (!token) {
    // Guest
    menuDiv.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
    roleInfo.innerText = 'Anda masuk sebagai: Guest';
  } else {
    const payload = parseJwt(token);
    if (!payload || !payload.role) {
      localStorage.removeItem('token');
      renderMenu();
      return;
    }
    if (payload.role === 'admin') {
      menuDiv.innerHTML = `
        <a href="dashboard.html">Dashboard Admin</a>
        <a href="#" onclick="logout()">Logout</a>
      `;
      roleInfo.innerText = 'Anda masuk sebagai: Admin';
    } else if (payload.role === 'user') {
      menuDiv.innerHTML = `
        <a href="dashboard.html">Dashboard User</a>
        <a href="#" onclick="logout()">Logout</a>
      `;
      roleInfo.innerText = 'Anda masuk sebagai: User';
    } else {
      menuDiv.innerHTML = `<a href="#" onclick="logout()">Logout</a>`;
      roleInfo.innerText = 'Role tidak dikenal';
    }
  }
}

function logout() {
  localStorage.removeItem('token');
  renderMenu();
}

// Dashboard role-based
function renderDashboard() {
  const token = localStorage.getItem('token');
  const dashboardContent = document.getElementById('dashboardContent');
  const dashboardMenu = document.getElementById('dashboardMenu');
  const dashboardRole = document.getElementById('dashboardRole');
  const userInfo = document.getElementById('userInfo');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  const payload = parseJwt(token);
  if (!payload || !payload.role) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
    return;
  }
  dashboardMenu.innerHTML = '';
  userInfo.innerHTML = '';
  if (payload.role === 'admin') {
    dashboardContent.innerHTML = '<b>Selamat datang, Admin!</b><br>Anda dapat mengelola user, event, laporan, dan data lainnya.';
    dashboardMenu.innerHTML = `
      <a href="index.html">Home</a>
      <a href="#" onclick="logout()">Logout</a>
    `;
    dashboardRole.innerText = 'Role: Admin';
    // Tampilkan info user (opsional)
    fetch('http://localhost:5000/api/user/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => {
        userInfo.innerText = 'Username: ' + (data.username || '-') + ' | Email: ' + (data.email || '-');
      });
  } else if (payload.role === 'user') {
    dashboardContent.innerHTML = '<b>Selamat datang, User!</b><br>Anda dapat mengikuti event, mengirim laporan, dan melihat sertifikat.';
    dashboardMenu.innerHTML = `
      <a href="index.html">Home</a>
      <a href="#" onclick="logout()">Logout</a>
    `;
    dashboardRole.innerText = 'Role: User';
    fetch('http://localhost:5000/api/user/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => {
        userInfo.innerText = 'Username: ' + (data.username || '-') + ' | Email: ' + (data.email || '-');
      });
  } else {
    dashboardContent.innerHTML = 'Role tidak dikenal.';
    dashboardMenu.innerHTML = `<a href="index.html">Home</a><a href="#" onclick="logout()">Logout</a>`;
    dashboardRole.innerText = 'Role: Tidak dikenal';
  }
}

// Panggil renderDashboard jika di dashboard.html
if (window.location.pathname.endsWith('dashboard.html')) {
  window.onload = renderDashboard;
}

// Render menu saat halaman dimuat
window.onload = function() {
  if (document.getElementById('menu')) renderMenu();
}

// Galeri Dokumentasi di index.html
async function loadGaleriDokumentasi() {
  const galeri = document.getElementById('galeriDokumentasi');
  if (!galeri) return;
  galeri.innerHTML = '<div>Memuat dokumentasi...</div>';
  try {
    const res = await fetch('http://localhost:5000/api/dokumentasi/public');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      galeri.innerHTML = data.map(dok => `
        <div style="background:#f7fefe;border-radius:10px;box-shadow:0 2px 8px #0001;padding:12px;width:180px;max-width:95%;text-align:center;">
          <img src='http://localhost:5000/uploads/${dok.gambar}' alt='${dok.judul}' style='width:100%;height:110px;object-fit:cover;border-radius:8px 8px 0 0;'>
          <div style='font-weight:bold;margin:8px 0 4px 0;color:#009688;'>${dok.judul}</div>
          <div style='font-size:0.97em;color:#555;'>${dok.deskripsi||''}</div>
          <div style='font-size:0.85em;color:#aaa;margin-top:4px;'>${new Date(dok.tanggal).toLocaleDateString('id-ID')}</div>
        </div>
      `).join('');
    } else {
      galeri.innerHTML = '<div>Belum ada dokumentasi.</div>';
    }
  } catch {
    galeri.innerHTML = '<div>Gagal memuat dokumentasi.</div>';
  }
}

if (document.getElementById('galeriDokumentasi')) loadGaleriDokumentasi(); 