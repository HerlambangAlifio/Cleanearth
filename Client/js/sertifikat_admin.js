// Sertifikat Admin JS
const API_URL = 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:5000';
const token = localStorage.getItem('token');

// Check authentication
if (!token) {
  window.location.href = 'login.html';
  throw new Error('Token tidak ditemukan');
}

const tabelSertifikat = document.getElementById('tabelSertifikat').querySelector('tbody');
const btnTambah = document.getElementById('btnTambahSertifikat');
const formContainer = document.getElementById('formSertifikatContainer');
const form = document.getElementById('formSertifikat');
const userSelect = document.getElementById('userId');
const eventSelect = document.getElementById('eventId');
const previewFile = document.getElementById('previewFile');
const submitBtn = document.getElementById('submitSertifikat');
const formTitle = document.getElementById('formTitle');
const loadingOverlay = document.getElementById('loadingOverlay');
const alertContainer = document.getElementById('alertContainer');
const formAlertContainer = document.getElementById('formAlertContainer');
const submitText = document.getElementById('submitText');
let editId = null;

// Utility functions
function showLoading() {
  loadingOverlay.style.display = 'flex';
}

function hideLoading() {
  loadingOverlay.style.display = 'none';
}

function showAlert(message, type = 'success', container = alertContainer) {
  const alertDiv = document.createElement('div');
  alertDiv.className = type === 'error' ? 'error-message' : 'success-message';
  alertDiv.textContent = message;
  container.appendChild(alertDiv);
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

function clearAlerts(container = alertContainer) {
  container.innerHTML = '';
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn && logoutBtn.addEventListener('click', function() {
  if(confirm('Anda yakin ingin logout?')) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
});

// Tombol tambah sertifikat
if (btnTambah) {
  btnTambah.addEventListener('click', () => {
    showForm();
  });
}

function showForm(data = null) {
  formContainer.style.display = 'block';
  form.reset();
  previewFile.innerHTML = '';
  previewFile.style.display = 'none';
  editId = null;
  clearAlerts(formAlertContainer);
  formTitle.textContent = data ? 'Edit Sertifikat' : 'Tambah Sertifikat';
  submitText.textContent = data ? 'Update' : 'Simpan';
  if (data) {
    userSelect.value = data.userId;
    eventSelect.value = data.eventId;
    editId = data.id;
    if (data.gambar) {
      previewFile.innerHTML = renderPreview(data.gambar);
      previewFile.style.display = 'block';
    }
  }
}

function hideForm() {
  formContainer.style.display = 'none';
  form.reset();
  previewFile.innerHTML = '';
  previewFile.style.display = 'none';
  editId = null;
  clearAlerts(formAlertContainer);
}

// Tambahkan tombol batal pada form
if (!document.getElementById('btnBatalSertifikat')) {
  const batalBtn = document.createElement('button');
  batalBtn.type = 'button';
  batalBtn.className = 'btn btn-secondary';
  batalBtn.id = 'btnBatalSertifikat';
  batalBtn.style = 'width:100%; margin-top:8px;';
  batalBtn.textContent = 'Batal';
  batalBtn.onclick = hideForm;
  form.appendChild(batalBtn);
}

// Fetch user & event for dropdown
async function fetchDropdowns() {
  try {
    // User
    const userRes = await fetch(`${API_URL}/user`, { 
      headers: { Authorization: 'Bearer ' + token } 
    });
    if (!userRes.ok) throw new Error('Gagal mengambil data user');
    const users = await userRes.json();
    userSelect.innerHTML = '<option value="">Pilih User</option>' + 
      users.map(u => `<option value="${u.id}">${u.username} (${u.email})</option>`).join('');
    // Event
    const eventRes = await fetch(`${API_URL}/event/public`);
    if (!eventRes.ok) throw new Error('Gagal mengambil data event');
    const events = await eventRes.json();
    eventSelect.innerHTML = '<option value="">Pilih Event</option>' + 
      events.map(e => `<option value="${e.id}">${e.judul}</option>`).join('');
  } catch (error) {
    console.error('Error fetching dropdowns:', error);
    showAlert('Gagal mengambil data dropdown: ' + error.message, 'error');
  }
}

// Fetch sertifikat
async function fetchSertifikat() {
  try {
    tabelSertifikat.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3>Loading...</h3>
            <p>Sedang memuat data sertifikat</p>
          </div>
        </td>
      </tr>
    `;
    const res = await fetch(`${API_URL}/sertifikat`, { 
      headers: { Authorization: 'Bearer ' + token } 
    });
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
      }
      throw new Error('Gagal mengambil data sertifikat');
    }
    const data = await res.json();
    if (!data.length) {
      tabelSertifikat.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="empty-state">
              <div class="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <path d="M8 8h8v8H8z"></path>
                  <polyline points="8 8 16 16"></polyline>
                </svg>
              </div>
              <h3>Belum ada sertifikat</h3>
              <p>Mulai dengan menambahkan sertifikat pertama Anda</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }
    tabelSertifikat.innerHTML = data.map(s => `
      <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.9rem;">
                ${s.User ? s.User.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div style="font-weight: 600; color: #1e293b;">${s.User ? s.User.username : '-'}</div>
                <div style="font-size: 0.8rem; color: #64748b;">${s.User ? s.User.email : '-'}</div>
              </div>
            </div>
          </td>
          <td>
            <div style="font-weight: 600; color: #1e293b;">${s.Event ? s.Event.judul : '-'}</div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 6px; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="color: white;">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <span style="font-weight: 500; color: #475569;">${s.gambar}</span>
            </div>
          </td>
          <td>
            <div style="font-weight: 500; color: #475569;">
              ${s.tanggal ? new Date(s.tanggal).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : '-'}
            </div>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn btn-secondary" onclick="previewSertifikat('${s.gambar}','${s.gambar.split('.').pop()}')" title="Preview">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Preview
              </button>
              <a class="btn btn-primary" href="${BASE_URL}/uploads/${s.gambar}" download target="_blank" title="Download">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download
              </a>
              <button class="btn btn-warning" onclick="window.editSertifikat(${s.id})" title="Edit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
              <button class="btn btn-danger" onclick="window.hapusSertifikat(${s.id})" title="Hapus">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Hapus
              </button>
            </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error fetching sertifikat:', error);
    tabelSertifikat.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <div class="empty-state-icon" style="background: linear-gradient(135deg, #fee2e2, #fecaca); color: #dc2626;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3>Error: ${error.message}</h3>
            <p>Gagal memuat data sertifikat. Silakan coba lagi.</p>
            <button class="btn-primary" onclick="fetchSertifikat()" style="margin-top: 16px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
              Coba Lagi
            </button>
          </div>
        </td>
      </tr>
    `;
  }
}

// Preview file
window.previewSertifikat = function(file, ext) {
  if (!file) return;
  const fileUrl = `${BASE_URL}/uploads/${file}`;
  if (['jpg','jpeg','png'].includes(ext.toLowerCase())) {
    window.open(fileUrl, '_blank');
  } else if (ext.toLowerCase() === 'pdf') {
    window.open(fileUrl, '_blank');
  } else {
    showAlert('Format file tidak didukung untuk preview', 'error');
  }
};

function renderPreview(file) {
  if (!file) return '';
  const ext = file.split('.').pop();
  if (['jpg','jpeg','png'].includes(ext.toLowerCase())) {
    return `<img src="${BASE_URL}/uploads/${file}" style="max-width:180px;max-height:120px;border-radius:8px;">`;
  } else if (ext.toLowerCase() === 'pdf') {
    return `<a href="${BASE_URL}/uploads/${file}" target="_blank" style="color:#667eea;">Lihat PDF</a>`;
  }
  return '';
}

// Tambah/Edit Sertifikat
form.onsubmit = async function(e) {
  e.preventDefault();
  const userId = form.userId.value;
  const eventId = form.eventId.value;
  const file = form.gambar.files[0];
  clearAlerts(formAlertContainer);
  if (!userId) {
    showAlert('Pilih user terlebih dahulu', 'error', formAlertContainer);
    return;
  }
  if (!editId && !file) {
    showAlert('Pilih file sertifikat terlebih dahulu', 'error', formAlertContainer);
    return;
  }
  try {
    submitBtn.disabled = true;
    submitText.textContent = 'Menyimpan...';
    const formData = new FormData(form);
    let url = `${API_URL}/sertifikat`;
    let method = 'POST';
    if (editId) {
      url += `/${editId}`;
      method = 'PATCH';
    }
    const res = await fetch(url, {
      method,
      headers: { Authorization: 'Bearer ' + token },
      body: formData
    });
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
      }
      const errorData = await res.json();
      throw new Error(errorData.message || 'Gagal menyimpan sertifikat');
    }
    const result = await res.json();
    showAlert(result.message || 'Sertifikat berhasil disimpan', 'success');
    hideForm();
    fetchSertifikat();
  } catch (error) {
    console.error('Error saving sertifikat:', error);
    showAlert('Gagal menyimpan sertifikat: ' + error.message, 'error', formAlertContainer);
  } finally {
    submitBtn.disabled = false;
    submitText.textContent = editId ? 'Update' : 'Simpan';
  }
};

// Edit Sertifikat
window.editSertifikat = async function(id) {
  try {
    showLoading();
    const res = await fetch(`${API_URL}/sertifikat/${id}`, {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
      }
      if (res.status === 404) {
        throw new Error('Sertifikat tidak ditemukan');
      }
      throw new Error('Gagal mengambil data sertifikat untuk diedit');
    }
    const sertifikat = await res.json();
    showForm(sertifikat);
  } catch (error) {
    console.error('Error editing sertifikat:', error);
    showAlert('Gagal mengambil data sertifikat: ' + error.message, 'error');
  } finally {
    hideLoading();
  }
};

// Hapus Sertifikat
window.hapusSertifikat = async function(id) {
  if (!confirm('Yakin ingin menghapus sertifikat ini?')) return;
  try {
    showLoading();
    const res = await fetch(`${API_URL}/sertifikat/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token }
    });
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
      }
      const errorData = await res.json();
      throw new Error(errorData.message || 'Gagal menghapus sertifikat');
    }
    const result = await res.json();
    showAlert(result.message || 'Sertifikat berhasil dihapus', 'success');
    fetchSertifikat();
  } catch (error) {
    console.error('Error deleting sertifikat:', error);
    showAlert('Gagal menghapus sertifikat: ' + error.message, 'error');
  } finally {
    hideLoading();
  }
};

// Preview file saat upload
form.gambar && form.gambar.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) {
    previewFile.innerHTML = '';
    previewFile.style.display = 'none';
    return;
  }
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showAlert('Ukuran file terlalu besar. Maksimal 5MB.', 'error', formAlertContainer);
    this.value = '';
    previewFile.innerHTML = '';
    previewFile.style.display = 'none';
    return;
  }
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['jpg','jpeg','png','pdf'].includes(ext)) {
    showAlert('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.', 'error', formAlertContainer);
    this.value = '';
    previewFile.innerHTML = '';
    previewFile.style.display = 'none';
    return;
  }
  if (['jpg','jpeg','png'].includes(ext)) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      previewFile.innerHTML = `<img src="${ev.target.result}" style="max-width:180px;max-height:120px;border-radius:8px;">`;
      previewFile.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else if (ext === 'pdf') {
    previewFile.innerHTML = `<span style="color:#16a34a; font-weight: 600;">File PDF terpilih: ${file.name}</span>`;
    previewFile.style.display = 'block';
  }
});

// Inisialisasi
(async function init() {
  try {
    showLoading();
    await fetchDropdowns();
    await fetchSertifikat();
  } catch (error) {
    console.error('Error initializing:', error);
    showAlert('Gagal menginisialisasi aplikasi: ' + error.message, 'error');
  } finally {
    hideLoading();
  }
})(); 