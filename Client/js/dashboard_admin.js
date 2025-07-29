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
if (!payload || payload.role !== 'admin') {
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

// CRUD Dokumentasi untuk Admin
const tabelDok = document.getElementById('tabelDokumentasi');
const formDok = document.getElementById('formDokumentasi');
const dokMsg = document.getElementById('dokMsg');
const btnBatalEdit = document.getElementById('btnBatalEdit');
let dokEditId = null;

async function loadDokumentasiAdmin() {
  if (!tabelDok) return;
  const tbody = tabelDok.querySelector('tbody');
  tbody.innerHTML = '<tr><td colspan="5">Memuat...</td></tr>';
  try {
    const res = await fetch('http://localhost:5000/api/dokumentasi', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      tbody.innerHTML = data.map(dok => `
        <tr>
4          <td>
            <img src='http://localhost:5000/uploads/${dok.gambar}' 
                 style='width:60px;height:40px;object-fit:cover;border-radius:4px;'
                 onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div style="display:none; width:60px; height:40px; background:#f0f0f0; border-radius:4px; align-items:center; justify-content:center; font-size:10px; color:#666;">
              📷
            </div>
          </td>
          <td>${dok.judul}</td>
          <td>${dok.deskripsi||''}</td>
          <td>${new Date(dok.tanggal).toLocaleDateString('id-ID')}</td>
          <td>
            <button onclick="editDok(${dok.id}, '${dok.judul.replace(/'/g,"&#39;")}', '${(dok.deskripsi||'').replace(/'/g,"&#39;")}', '${dok.gambar}')">Edit</button>
            <button onclick="hapusDok(${dok.id})" style='margin-left:4px;background:#e53935;'>Hapus</button>
          </td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="5">Belum ada dokumentasi.</td></tr>';
    }
  } catch {
    tbody.innerHTML = '<tr><td colspan="5">Gagal memuat data.</td></tr>';
  }
}

window.editDok = function(id, judul, deskripsi, gambar) {
  dokEditId = id;
  document.getElementById('dokId').value = id;
  document.getElementById('dokJudul').value = judul;
  document.getElementById('dokDeskripsi').value = deskripsi;
  btnBatalEdit.style.display = '';
  document.getElementById('btnSimpanDok').innerText = 'Update Dokumentasi';
};

window.hapusDok = async function(id) {
  if (!confirm('Yakin hapus dokumentasi ini?')) return;
  dokMsg.innerText = '';
  try {
    const res = await fetch(`http://localhost:5000/api/dokumentasi/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    const data = await res.json();
    if (res.ok) {
      dokMsg.innerText = 'Berhasil dihapus';
      loadDokumentasiAdmin();
    } else {
      dokMsg.innerText = data.message || 'Gagal menghapus';
    }
  } catch {
    dokMsg.innerText = 'Gagal menghapus';
  }
};

if (btnBatalEdit) btnBatalEdit.onclick = function() {
  dokEditId = null;
  formDok.reset();
  btnBatalEdit.style.display = 'none';
  document.getElementById('btnSimpanDok').innerText = 'Tambah Dokumentasi';
};

if (formDok) {
  formDok.onsubmit = async function(e) {
    e.preventDefault();
    dokMsg.innerText = '';
    const id = document.getElementById('dokId').value;
    const judul = document.getElementById('dokJudul').value;
    const deskripsi = document.getElementById('dokDeskripsi').value;
    const gambarInput = document.getElementById('dokGambar');
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    if (gambarInput.files[0]) formData.append('gambar', gambarInput.files[0]);
    let url = 'http://localhost:5000/api/dokumentasi';
    let method = 'POST';
    if (dokEditId || id) {
      url += `/${dokEditId||id}`;
      method = 'PATCH';
    }
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        dokMsg.innerText = dokEditId ? 'Berhasil diupdate' : 'Berhasil ditambah';
        formDok.reset();
        dokEditId = null;
        btnBatalEdit.style.display = 'none';
        document.getElementById('btnSimpanDok').innerText = 'Tambah Dokumentasi';
        loadDokumentasiAdmin();
      } else {
        dokMsg.innerText = data.message || 'Gagal simpan';
      }
    } catch {
      dokMsg.innerText = 'Gagal simpan';
    }
  };
}

if (tabelDok) loadDokumentasiAdmin();

// Sidebar navigation logic
const menuDashboard = document.getElementById('menuDashboard');
const menuDokumentasi = document.getElementById('menuDokumentasi');
const sectionDashboard = document.getElementById('sectionDashboard');
const sectionDokumentasi = document.getElementById('sectionDokumentasi');

if (menuDashboard && menuDokumentasi && sectionDashboard && sectionDokumentasi) {
  menuDashboard.onclick = function() {
    sectionDashboard.style.display = '';
    sectionDokumentasi.style.display = 'none';
    menuDashboard.classList.add('active');
    menuDokumentasi.classList.remove('active');
  };
  menuDokumentasi.onclick = function() {
    sectionDashboard.style.display = 'none';
    sectionDokumentasi.style.display = '';
    menuDashboard.classList.remove('active');
    menuDokumentasi.classList.add('active');
  };
}

if (sectionDokumentasi) {
  sectionDokumentasi.innerHTML = '<iframe src="dokumentasi_admin.html" style="width:100%;min-height:600px;border:none;border-radius:12px;box-shadow:0 2px 12px #0001;"></iframe>';
} 