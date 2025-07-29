// Jika sudah login, redirect ke dashboard sesuai role
(function() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.role === 'admin') {
        window.location.href = 'dashboard_admin.html';
      } else if (payload.role === 'user') {
        window.location.href = 'dashboard_user.html';
      }
    } catch {}
  }
})();

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    errorDiv.innerText = '';
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        try {
          const payload = JSON.parse(atob(data.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
          if (payload.role === 'admin') {
            window.location.href = 'dashboard_admin.html';
          } else if (payload.role === 'user') {
            window.location.href = 'dashboard_user.html';
          } else {
            errorDiv.innerText = 'Role tidak dikenal, hubungi admin.';
          }
        } catch {
          errorDiv.innerText = 'Token tidak valid.';
        }
      } else {
        errorDiv.innerText = data.message || 'Login gagal';
      }
    } catch (err) {
      errorDiv.innerText = 'Terjadi kesalahan koneksi. Coba lagi.';
    }
  });
}

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const nama_lengkap = document.getElementById('nama_lengkap').value;
    const alamat = document.getElementById('alamat').value;
    const no_hp = document.getElementById('no_hp').value;
    const foto_profil = document.getElementById('foto_profil').value;
    const errorDiv = document.getElementById('registerError');
    const successDiv = document.getElementById('registerSuccess');
    errorDiv.innerText = '';
    successDiv.innerText = '';
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role, nama_lengkap, alamat, no_hp, foto_profil })
      });
      const data = await res.json();
      if (res.ok) {
        successDiv.innerText = 'Registrasi berhasil! Silakan login.';
        setTimeout(() => window.location.href = 'login.html', 1200);
      } else {
        errorDiv.innerText = data.message || 'Registrasi gagal';
      }
    } catch (err) {
      errorDiv.innerText = 'Terjadi kesalahan koneksi. Coba lagi.';
    }
  });
}
