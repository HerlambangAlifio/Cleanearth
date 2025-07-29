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

// Global variables
let dashboardLoaded = false;
let eventsLoaded = false;
let myEventsLoaded = false;

// Tampilkan info user
async function loadUserInfo() {
  try {
    const response = await fetch('http://localhost:5000/api/user/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    
    if (!response.ok) throw new Error('Failed to fetch user data');
    
    const data = await response.json();
    const user = data.user || data;
    const username = user.username || 'Tidak diketahui';
    const email = user.email || 'Tidak diketahui';
    
    // Update user info in sidebar
    document.getElementById('userName').textContent = username;
    document.getElementById('userEmail').textContent = email;
    
    // Update avatar with first letter of username
    const userAvatar = document.getElementById('userAvatar');
    userAvatar.textContent = username.charAt(0).toUpperCase();
    
    return user;
  } catch (error) {
    console.error('Error loading user info:', error);
    document.getElementById('userName').textContent = 'User';
    document.getElementById('userEmail').textContent = 'user@example.com';
  }
}

// Load dashboard data
async function loadDashboard() {
  try {
    // Show loading state
    showLoading();
    
    // Load all data in parallel
    const [eventsRes, myEventsRes, sertifikatRes] = await Promise.all([
      fetch('http://localhost:5000/api/event/public'),
      fetch('http://localhost:5000/api/event/mine', {
        headers: { 'Authorization': 'Bearer ' + token }
      }),
      fetch('http://localhost:5000/api/sertifikat/user', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
    ]);

    if (!eventsRes.ok || !myEventsRes.ok || !sertifikatRes.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const events = await eventsRes.json();
    const myEvents = await myEventsRes.json();
    const sertifikat = await sertifikatRes.json();

    // Update stats
    updateStats(events, myEvents, sertifikat);
    
    // Load recent events
    loadRecentEvents(events.slice(0, 3), myEvents);
    
    // Load sertifikat
    loadSertifikat(sertifikat);
    
    hideLoading();
  } catch (error) {
    console.error('Error loading dashboard:', error);
    hideLoading();
    showError('Gagal memuat data dashboard. Silakan coba lagi.');
  }
}

// Update statistics
function updateStats(events, myEvents, sertifikat) {
  const totalEvents = events.length;
  const joinedEvents = myEvents.length;
  const pendingEvents = myEvents.filter(event => event.status === 'pending').length;
  const totalSertifikat = sertifikat.length;

  document.getElementById('totalEvents').textContent = totalEvents;
  document.getElementById('joinedEvents').textContent = joinedEvents;
  document.getElementById('pendingEvents').textContent = pendingEvents;
  document.getElementById('totalSertifikat').textContent = totalSertifikat;
}

// Load recent events
function loadRecentEvents(events, myEvents=[]) {
  const container = document.getElementById('eventGrid');
  
  if (events.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <h3>Tidak ada event</h3>
        <p>Belum ada event yang tersedia saat ini.</p>
        <a href="event.html" class="btn btn-primary">Lihat Semua Event</a>
      </div>
    `;
    return;
  }
  
  container.innerHTML = events.map(event => createEventCard(event, myEvents)).join('');
}

// Create event card
function createEventCard(event, myEvents=[]) {
  const eventDate = new Date(event.tanggal).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const statusText = {
    'upcoming': 'Akan Datang',
    'ongoing': 'Sedang Berlangsung',
    'completed': 'Selesai',
    'cancelled': 'Dibatalkan'
  };
  
  const statusClass = `status-${event.status}`;
  const statusLabel = statusText[event.status] || 'Unknown';
  
  // Perbaikan path gambar event
  const gambarUrl = event.gambar ? `http://localhost:5000/uploads/${event.gambar}` : 'assets/kegiatan.png';

  // Cek apakah user sudah mendaftar event ini
  const sudahDaftar = myEvents.some(e => e.id === event.id);

  return `
    <div class="event-card">
      <img src="${gambarUrl}" alt="${event.judul}" class="event-image" onerror="this.src='assets/kegiatan.png'">
      <div class="event-content">
        <h3 class="event-title">${event.judul}</h3>
        <p class="event-description">${event.deskripsi}</p>
        <div class="event-meta">
          <span class="event-date">${eventDate}</span>
          <span class="event-status ${statusClass}">${statusLabel}</span>
        </div>
        ${
          sudahDaftar
            ? '<button class="btn btn-success" disabled>Sudah Terdaftar</button>'
            : `<a href="form_pendaftaran_event.html?eventId=${event.id}" class="btn btn-primary">Registrasi</a>`
        }
      </div>
    </div>
  `;
}

// Load sertifikat
function loadSertifikat(sertifikat) {
  const container = document.getElementById('sertifikatGrid');
  
  if (sertifikat.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <h3>Belum ada sertifikat</h3>
        <p>Anda belum memiliki sertifikat event. Ikuti event untuk mendapatkan sertifikat!</p>
        <a href="event.html" class="btn btn-primary">Lihat Event</a>
      </div>
    `;
    return;
  }
  
  container.innerHTML = sertifikat.map(s => createSertifikatCard(s)).join('');
}

// Create sertifikat card
function createSertifikatCard(sertifikat) {
  const event = sertifikat.Event;
  const gambarUrl = `http://localhost:5000/uploads/${sertifikat.gambar}`;

  if (!event) {
    return `
      <div class="sertifikat-card">
        <div class="sertifikat-image-wrapper">
          <img src="${gambarUrl}" alt="Sertifikat" class="sertifikat-image" onerror="this.src='assets/sertifikat cleanearth.png'; this.classList.add('fallback');">
        </div>
        <div class="sertifikat-content">
          <h3 class="sertifikat-title">Event tidak ditemukan</h3>
          <p class="sertifikat-subtitle">Diterbitkan pada: ${new Date(sertifikat.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <a href="${gambarUrl}" download class="btn btn-secondary download-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download
          </a>
        </div>
      </div>
    `;
  }

  return `
    <div class="sertifikat-card">
      <div class="sertifikat-image-wrapper">
        <img src="${gambarUrl}" alt="Sertifikat untuk ${event.judul}" class="sertifikat-image" onerror="this.src='assets/sertifikat cleanearth.png'; this.classList.add('fallback');">
        <div class="sertifikat-overlay">
          <a href="${gambarUrl}" target="_blank" class="btn btn-primary view-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            Lihat
          </a>
        </div>
      </div>
      <div class="sertifikat-content">
        <h3 class="sertifikat-title">${event.judul}</h3>
        <p class="sertifikat-subtitle">Diterbitkan pada: ${new Date(sertifikat.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <a href="${gambarUrl}" download class="btn btn-secondary download-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Download
        </a>
      </div>
    </div>
  `;
}

// Navigation function
function showSection(sectionName) {
  // Hide all sections
  document.getElementById('dashboard-section').style.display = 'none';
  document.getElementById('events-section').style.display = 'none';
  document.getElementById('my-events-section').style.display = 'none';
  document.getElementById('profile-section').style.display = 'none';
  
  // Remove active class from all menu items
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Show selected section
  document.getElementById(sectionName + '-section').style.display = 'block';
  
  // Add active class to clicked menu item
  event.target.classList.add('active');
  
  // Load data based on section
  switch(sectionName) {
    case 'dashboard':
      if (!dashboardLoaded) {
        loadDashboard();
        dashboardLoaded = true;
      }
      break;
    case 'events':
      if (!eventsLoaded) {
        loadAllEvents();
        eventsLoaded = true;
      }
      break;
    case 'my-events':
      if (!myEventsLoaded) {
        loadMyEvents();
        myEventsLoaded = true;
      }
      break;
    case 'profile':
      loadUserProfile();
      break;
  }
}

// Load all events
async function loadAllEvents() {
  try {
    const container = document.getElementById('allEvents');
    container.innerHTML = '<div class="loading">Memuat event...</div>';
    
    const response = await fetch('http://localhost:5000/api/event/public');
    if (!response.ok) throw new Error('Failed to fetch events');
    
    const events = await response.json();
    
    if (events.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h3>Tidak ada event</h3>
          <p>Belum ada event yang tersedia saat ini.</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = events.map(event => createEventCard(event)).join('');
  } catch (error) {
    console.error('Error loading all events:', error);
    document.getElementById('allEvents').innerHTML = `
      <div class="empty-state">
        <h3>Error</h3>
        <p>Gagal memuat event. Silakan coba lagi.</p>
      </div>
    `;
  }
}

// Load my events
async function loadMyEvents() {
  try {
    const container = document.getElementById('myEvents');
    container.innerHTML = '<div class="loading">Memuat event...</div>';
    
    const response = await fetch('http://localhost:5000/api/event/mine', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!response.ok) throw new Error('Failed to fetch my events');
    
    const events = await response.json();
    
    if (events.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
          <h3>Belum ada event</h3>
          <p>Anda belum mengikuti event apapun.</p>
          <a href="event.html" class="btn btn-primary">Lihat Event Tersedia</a>
        </div>
      `;
      return;
    }
    // Jika data adalah array pendaftaran (ada field Event), gunakan event.Event
    container.innerHTML = events.map(ev => createEventCard(ev.Event ? ev.Event : ev)).join('');
  } catch (error) {
    console.error('Error loading my events:', error);
    document.getElementById('myEvents').innerHTML = `
      <div class="empty-state">
        <h3>Error</h3>
        <p>Gagal memuat event. Silakan coba lagi.</p>
      </div>
    `;
  }
}

// Load user profile
async function loadUserProfile() {
  try {
    const response = await fetch('http://localhost:5000/api/user/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    
    if (!response.ok) throw new Error('Failed to fetch user profile');
    
    const data = await response.json();
    const user = data.user || data;
    // Ambil field nama lengkap, alamat, no_hp baik snake_case maupun camelCase
    const namaLengkap = user.nama_lengkap || user.namaLengkap || '-';
    const alamat = user.alamat || user.Alamat || '-';
    const noHp = user.no_hp || user.noHp || '-';
    // Update profile elements (profile section)
    document.getElementById('profileUsername').textContent = user.username || 'Tidak diketahui';
    document.getElementById('profileEmail').textContent = user.email || 'Tidak diketahui';
    document.getElementById('profileRole').textContent = user.role || 'user';
    document.getElementById('profileNamaLengkap').textContent = namaLengkap;
    document.getElementById('profileAlamat').textContent = alamat;
    document.getElementById('profileNoHp').textContent = noHp;
    // Update sidebar
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    if (userName) userName.textContent = user.username || '-';
    if (userEmail) userEmail.textContent = user.email || '-';
    if (userAvatar) {
      if (user.foto) {
        userAvatar.innerHTML = `<img src="http://localhost:5000/uploads/${user.foto}" alt="Profile" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">`;
      } else {
        userAvatar.textContent = (user.username || 'U').charAt(0).toUpperCase();
      }
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
    showError('Gagal memuat data profile');
  }
}

// Loading states
function showLoading() {
  const loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'loadingOverlay';
  loadingOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;
  loadingOverlay.innerHTML = `
    <div style="text-align: center;">
      <div class="loading-spinner"></div>
      <p style="margin-top: 16px; color: #666;">Memuat data...</p>
    </div>
  `;
  document.body.appendChild(loadingOverlay);
}

function hideLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.remove();
  }
}

// Error handling
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #e74c3c;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    max-width: 300px;
    animation: slideIn 0.3s ease;
  `;
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Success handling
function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// Initialize dashboard
async function initDashboard() {
  try {
    await loadUserProfile(); // Ambil data user dari backend dan update sidebar
    await loadDashboard();
    dashboardLoaded = true;
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    showError('Gagal memuat dashboard. Silakan coba lagi.');
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize dashboard
  initDashboard();
  
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  // Refresh button
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async function() {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = `
        <div class="loading-spinner" style="width: 16px; height: 16px; border: 2px solid #f3f3f3; border-top: 2px solid white;"></div>
        Refreshing...
      `;
      
      try {
        await loadDashboard();
        showSuccess('Dashboard berhasil diperbarui!');
      } catch (error) {
        showError('Gagal memperbarui dashboard');
      } finally {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M23 4v6h-6"></path>
            <path d="M1 20v-6h6"></path>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
          Refresh
        `;
      }
    });
  }
}); 