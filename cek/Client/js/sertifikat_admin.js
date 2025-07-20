// Sertifikat Admin JS
const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

const tabelSertifikat = document.getElementById('tabelSertifikat').querySelector('tbody');
const btnTambah = document.getElementById('btnTambahSertifikat');
const modal = document.getElementById('modalSertifikat');
const closeModal = document.getElementById('closeModal');
const form = document.getElementById('formSertifikat');
const userSelect = document.getElementById('userId');
const eventSelect = document.getElementById('eventId');
const previewFile = document.getElementById('previewFile');
const submitBtn = document.getElementById('submitSertifikat');
const modalTitle = document.getElementById('modalTitle');
let editId = null;

// Logout
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn && logoutBtn.addEventListener('click', function() {
  if(confirm('Anda yakin ingin logout?')) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
});

// Modal logic
btnTambah.addEventListener('click', () => openModal());
closeModal.addEventListener('click', () => closeModalFunc());
window.onclick = function(event) { if (event.target === modal) closeModalFunc(); };

function openModal(data = null) {
  modal.style.display = 'block';
  form.reset();
  previewFile.innerHTML = '';
  editId = null;
  modalTitle.textContent = data ? 'Edit Sertifikat' : 'Tambah Sertifikat';
  submitBtn.textContent = data ? 'Update' : 'Simpan';
  if (data) {
    userSelect.value = data.userId;
    eventSelect.value = data.eventId;
    editId = data.id;
    if (data.gambar) previewFile.innerHTML = renderPreview(data.gambar);
  }
}
function closeModalFunc() { modal.style.display = 'none'; form.reset(); previewFile.innerHTML = ''; editId = null; }

// Fetch user & event for dropdown
async function fetchDropdowns() {
  // User
  const userRes = await fetch(`${API_URL}/user`, { headers: { Authorization: 'Bearer ' + token } });
  const users = await userRes.json();
  userSelect.innerHTML = users.map(u => `<option value="${u.id}">${u.username} (${u.email})</option>`).join('');
  // Event
  const eventRes = await fetch(`${API_URL}/event/public`);
  const events = await eventRes.json();
  eventSelect.innerHTML = events.map(e => `<option value="${e.id}">${e.judul}</option>`).join('');
}

// Fetch sertifikat
async function fetchSertifikat() {
  tabelSertifikat.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  const res = await fetch(`${API_URL}/sertifikat`, { headers: { Authorization: 'Bearer ' + token } });
  const data = await res.json();
  if (!data.length) {
    tabelSertifikat.innerHTML = '<tr><td colspan="5">Belum ada sertifikat</td></tr>';
    return;
  }
  tabelSertifikat.innerHTML = data.map(s => `
    <tr>
      <td>${s.User ? s.User.username : '-'}</td>
      <td>${s.Event ? s.Event.judul : '-'}</td>
      <td>${s.gambar}</td>
      <td>${s.tanggal ? new Date(s.tanggal).toLocaleDateString('id-ID') : '-'}</td>
      <td>
        <button class="btn btn-secondary" onclick="previewSertifikat('${s.gambar}','${s.gambar.split('.').pop()}')">Preview</button>
        <a class="btn btn-primary" href="http://localhost:5000/uploads/${s.gambar}" download target="_blank">Download</a>
        <button class="btn btn-warning" onclick="editSertifikat(${s.id})">Edit</button>
        <button class="btn btn-danger" onclick="hapusSertifikat(${s.id})">Hapus</button>
      </td>
    </tr>
  `).join('');
}

// Preview file
window.previewSertifikat = function(file, ext) {
  if (!file) return;
  if (['jpg','jpeg','png'].includes(ext.toLowerCase())) {
    window.open(`http://localhost:5000/uploads/${file}`,'_blank');
  } else if (ext.toLowerCase() === 'pdf') {
    window.open(`http://localhost:5000/uploads/${file}`,'_blank');
  }
};
function renderPreview(file) {
  const ext = file.split('.').pop();
  if (['jpg','jpeg','png'].includes(ext.toLowerCase())) {
    return `<img src="http://localhost:5000/uploads/${file}" style="max-width:180px;max-height:120px;">`;
  } else if (ext.toLowerCase() === 'pdf') {
    return `<a href="http://localhost:5000/uploads/${file}" target="_blank">Lihat PDF</a>`;
  }
  return '';
}

// Tambah/Edit Sertifikat
form.onsubmit = async function(e) {
  e.preventDefault();
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
  if (res.ok) {
    closeModalFunc();
    fetchSertifikat();
  } else {
    alert('Gagal menyimpan sertifikat');
  }
};

// Edit Sertifikat
window.editSertifikat = async function(id) {
  const res = await fetch(`${API_URL}/sertifikat`, { headers: { Authorization: 'Bearer ' + token } });
  const data = await res.json();
  const sertifikat = data.find(s => s.id === id);
  if (!sertifikat) return;
  openModal(sertifikat);
};

// Hapus Sertifikat
window.hapusSertifikat = async function(id) {
  if (!confirm('Yakin ingin menghapus sertifikat ini?')) return;
  const res = await fetch(`${API_URL}/sertifikat/${id}`, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token }
  });
  if (res.ok) fetchSertifikat();
  else alert('Gagal menghapus sertifikat');
};

// Preview file saat upload
form.gambar && form.gambar.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return previewFile.innerHTML = '';
  const ext = file.name.split('.').pop();
  if (['jpg','jpeg','png'].includes(ext.toLowerCase())) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      previewFile.innerHTML = `<img src="${ev.target.result}" style="max-width:180px;max-height:120px;">`;
    };
    reader.readAsDataURL(file);
  } else if (ext.toLowerCase() === 'pdf') {
    previewFile.innerHTML = `<span>File PDF terpilih: ${file.name}</span>`;
  } else {
    previewFile.innerHTML = '<span>File tidak didukung</span>';
  }
});

// Inisialisasi
(async function init() {
  await fetchDropdowns();
  await fetchSertifikat();
})(); 