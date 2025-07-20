// Cek token dan role
const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

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

const payload = parseJwt(token);
if (!payload || payload.role !== 'user') {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// Tampilkan info user
fetch('http://localhost:5000/api/user/me', {
  headers: { 'Authorization': 'Bearer ' + token }
})
  .then(res => res.json())
  .then(data => {
    const username = data.username || (data.user && data.user.username) || 'Tidak diketahui';
    const email = data.email || (data.user && data.user.email) || 'Tidak diketahui';
    document.getElementById('userInfo').innerText = 'Username: ' + username + ' | Email: ' + email;
  })
  .catch(() => {
    document.getElementById('userInfo').innerText = 'Gagal mengambil data user';
  });

// Logout
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.onclick = function() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}; 