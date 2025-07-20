// Fungsi dasar untuk request ke backend
const API_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function apiRequest(endpoint, options = {}) {
  const headers = options.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  headers['Content-Type'] = 'application/json';
  const res = await fetch(API_URL + endpoint, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    window.location.href = 'login.html';
  }
  return { ok: res.ok, status: res.status, data };
}
