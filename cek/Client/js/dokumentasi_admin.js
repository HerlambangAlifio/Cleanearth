// CRUD Dokumentasi untuk Admin (standalone)
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
          <td>
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
            <div class="action-buttons">
              <button class="action-btn edit-btn" onclick="editDok(${dok.id}, '${dok.judul.replace(/'/g,"&#39;")}', '${(dok.deskripsi||'').replace(/'/g,"&#39;")}', '${dok.gambar}')">Edit</button>
              <button class="action-btn delete-btn" onclick="hapusDok(${dok.id})">Hapus</button>
            </div>
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
  document.getElementById('btnSimpanDok').innerText = 'Simpan Dokumentasi';
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
        document.getElementById('btnSimpanDok').innerText = 'Simpan Dokumentasi';
        // Tunggu backend selesai, lalu refresh tabel (hindari duplikasi)
        setTimeout(loadDokumentasiAdmin, 200);
      } else {
        dokMsg.innerText = data.message || 'Gagal simpan';
      }
    } catch {
      dokMsg.innerText = 'Gagal simpan';
    }
  };
}

if (tabelDok) loadDokumentasiAdmin(); 