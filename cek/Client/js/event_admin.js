// CRUD Event untuk Admin
const tabelEvent = document.getElementById('tabelEvent');
const formEvent = document.getElementById('formEvent');
const eventMsg = document.getElementById('eventMsg');
const btnBatalEdit = document.getElementById('btnBatalEdit');
let eventEditId = null;

// Fungsi untuk mendapatkan status badge
function getStatusBadge(status) {
  const statusText = {
    'upcoming': 'Upcoming',
    'ongoing': 'Ongoing', 
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  
  return `<span class="status-badge status-${status}">${statusText[status]}</span>`;
}

// Fungsi untuk format tanggal
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Fungsi untuk format waktu
function formatTime(timeString) {
  return timeString.substring(0, 5); // Ambil HH:MM saja
}

async function loadEventAdmin() {
  if (!tabelEvent) return;
  const tbody = tabelEvent.querySelector('tbody');
  tbody.innerHTML = '<tr><td colspan="8">Memuat...</td></tr>';
  
  try {
    const res = await fetch('http://localhost:5000/api/event', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (Array.isArray(data) && data.length > 0) {
      tbody.innerHTML = data.map(event => `
        <tr>
          <td>
            <img src='http://localhost:5000/uploads/${event.gambar || 'default-event.jpg'}' 
                 style='width:60px;height:40px;object-fit:cover;border-radius:4px;'
                 onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div style="display:none; width:60px; height:40px; background:#f0f0f0; border-radius:4px; align-items:center; justify-content:center; font-size:10px; color:#666;">
              📷
            </div>
          </td>
          <td>${event.judul || 'N/A'}</td>
          <td>${event.lokasi || 'N/A'}</td>
          <td>${event.tanggal ? formatDate(event.tanggal) : 'N/A'}</td>
          <td>${event.waktu_mulai && event.waktu_selesai ? formatTime(event.waktu_mulai) + ' - ' + formatTime(event.waktu_selesai) : 'N/A'}</td>
          <td>${event.kapasitas || 'N/A'}</td>
          <td>${event.status ? getStatusBadge(event.status) : 'N/A'}</td>
          <td>
            <div class="action-buttons">
              <button class="action-btn edit-btn" onclick="editEvent(${event.id}, '${(event.judul || '').replace(/'/g,"&#39;")}', '${(event.deskripsi || '').replace(/'/g,"&#39;")}', '${(event.lokasi || '').replace(/'/g,"&#39;")}', '${event.tanggal ? event.tanggal.split('T')[0] : ''}', '${event.waktu_mulai || ''}', '${event.waktu_selesai || ''}', ${event.kapasitas || 0}, '${event.status || ''}', '${event.gambar || ''}')">Edit</button>
              <button class="action-btn delete-btn" onclick="hapusEvent(${event.id})">Hapus</button>
            </div>
          </td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="8">Belum ada event.</td></tr>';
    }
  } catch (error) {
    console.error('Error loading events:', error);
    tbody.innerHTML = '<tr><td colspan="8">Gagal memuat data: ' + error.message + '</td></tr>';
  }
}

window.editEvent = function(id, judul, deskripsi, lokasi, tanggal, waktuMulai, waktuSelesai, kapasitas, status, gambar) {
  eventEditId = id;
  document.getElementById('eventId').value = id;
  document.getElementById('eventJudul').value = judul || '';
  document.getElementById('eventDeskripsi').value = deskripsi || '';
  document.getElementById('eventLokasi').value = lokasi || '';
  document.getElementById('eventTanggal').value = tanggal || '';
  document.getElementById('eventWaktuMulai').value = waktuMulai || '';
  document.getElementById('eventWaktuSelesai').value = waktuSelesai || '';
  document.getElementById('eventKapasitas').value = kapasitas || '';
  document.getElementById('eventStatus').value = status || 'upcoming';
  
  btnBatalEdit.style.display = '';
  document.getElementById('btnSimpanEvent').innerText = 'Update Event';
  eventMsg.innerText = '';
};

window.hapusEvent = async function(id) {
  const confirmMessage = '⚠️ PERHATIAN!\n\n' +
    'Anda akan menghapus event ini beserta:\n' +
    '• Semua pendaftaran event\n' +
    '• Data peserta yang terdaftar\n' +
    '• Gambar event\n\n' +
    'Tindakan ini TIDAK DAPAT DIBATALKAN!\n\n' +
    'Apakah Anda yakin ingin melanjutkan?';
    
  if (!confirm(confirmMessage)) return;
  
  // Reset message styling
  eventMsg.className = '';
  eventMsg.innerText = 'Menghapus event...';
  
  try {
    const res = await fetch(`http://localhost:5000/api/event/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    const data = await res.json();
    
    if (res.ok) {
      eventMsg.className = 'success';
      eventMsg.innerText = '✅ Event berhasil dihapus';
      setTimeout(() => {
        eventMsg.innerText = '';
        eventMsg.className = '';
      }, 3000);
      loadEventAdmin();
    } else {
      eventMsg.className = 'error';
      eventMsg.innerText = '❌ ' + (data.message || 'Gagal menghapus event');
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    eventMsg.className = 'error';
    eventMsg.innerText = '❌ Gagal menghapus event: ' + error.message;
  }
};

if (btnBatalEdit) {
  btnBatalEdit.onclick = function() {
    eventEditId = null;
    formEvent.reset();
    btnBatalEdit.style.display = 'none';
    document.getElementById('btnSimpanEvent').innerText = 'Simpan Event';
    eventMsg.innerText = '';
  };
}

if (formEvent) {
  formEvent.onsubmit = async function(e) {
    e.preventDefault();
    eventMsg.innerText = '';
    
    const id = document.getElementById('eventId').value;
    const judul = document.getElementById('eventJudul').value;
    const deskripsi = document.getElementById('eventDeskripsi').value;
    const lokasi = document.getElementById('eventLokasi').value;
    const tanggal = document.getElementById('eventTanggal').value;
    const waktuMulai = document.getElementById('eventWaktuMulai').value;
    const waktuSelesai = document.getElementById('eventWaktuSelesai').value;
    const kapasitas = document.getElementById('eventKapasitas').value;
    const status = document.getElementById('eventStatus').value;
    const gambarInput = document.getElementById('eventGambar');
    
    // Validasi waktu
    if (waktuMulai >= waktuSelesai) {
      eventMsg.innerText = 'Waktu selesai harus lebih besar dari waktu mulai';
      return;
    }
    
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('lokasi', lokasi);
    formData.append('tanggal', tanggal);
    formData.append('waktu_mulai', waktuMulai);
    formData.append('waktu_selesai', waktuSelesai);
    formData.append('kapasitas', kapasitas);
    formData.append('status', status);
    
    if (gambarInput.files[0]) {
      formData.append('gambar', gambarInput.files[0]);
    }
    
    let url = 'http://localhost:5000/api/event';
    let method = 'POST';
    
    if (eventEditId || id) {
      url += `/${eventEditId || id}`;
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
        eventMsg.innerText = eventEditId ? 'Event berhasil diupdate' : 'Event berhasil ditambahkan';
        formEvent.reset();
        eventEditId = null;
        btnBatalEdit.style.display = 'none';
        document.getElementById('btnSimpanEvent').innerText = 'Simpan Event';
        document.getElementById('eventId').value = '';
        
        // Tunggu backend selesai, lalu refresh tabel
        setTimeout(loadEventAdmin, 500);
      } else {
        eventMsg.innerText = data.message || 'Gagal menyimpan event';
      }
    } catch (error) {
      console.error('Error saving event:', error);
      eventMsg.innerText = 'Gagal menyimpan event: ' + error.message;
    }
  };
}

// Set tanggal minimum ke hari ini
document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('eventTanggal').min = today;
  
  // Load events saat halaman dimuat
  if (tabelEvent) {
    loadEventAdmin();
  }
}); 