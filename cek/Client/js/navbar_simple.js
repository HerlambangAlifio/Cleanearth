// CleanEarth - Simple Navbar JavaScript (Fallback)

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

// Get user info from token
function getUserInfo() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}

// Render simple navbar
function renderNavbarPublic(active) {
  const userInfo = getUserInfo();
  const isUserLoggedIn = isLoggedIn();
  
  // Find navbar placeholder
  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  if (!navbarPlaceholder) {
    console.error('Navbar placeholder not found!');
    return;
  }
  
  navbarPlaceholder.innerHTML = `
    <nav class="navbar" style="
      width: 100%;
      background: #ffffff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      min-height: 70px;
    ">
      <div class="nav-logo" onclick="window.location.href='index.html'" style="
        font-size: 1.5rem;
        font-weight: 700;
        color: #009688;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
      ">
        <span style="
          width: 32px;
          height: 32px;
          background: #009688;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        ">🌍</span>
        <span>CleanEarth</span>
      </div>
      
      <div class="nav-links" style="
        display: flex;
        align-items: center;
        gap: 2rem;
      ">
        <a href="index.html"${active === 'home' ? ' style="color: #009688; font-weight: 600;"' : ' style="color: #333; text-decoration: none; font-weight: 500;"'}>
          🏠 Home
        </a>
        <a href="dokumentasi.html"${active === 'dokumentasi' ? ' style="color: #009688; font-weight: 600;"' : ' style="color: #333; text-decoration: none; font-weight: 500;"'}>
          📚 Dokumentasi
        </a>
        <a href="event_guest.html"${active === 'event' ? ' style="color: #009688; font-weight: 600;"' : ' style="color: #333; text-decoration: none; font-weight: 500;"'}>
          📅 Event
        </a>
        ${isUserLoggedIn ? `
          <a href="my_events.html"${active === 'my-events' ? ' style="color: #009688; font-weight: 600;"' : ' style="color: #333; text-decoration: none; font-weight: 500;"'}>
            🎯 Event Saya
          </a>
        ` : ''}
      </div>
      
      <div class="nav-auth" style="
        display: flex;
        align-items: center;
        gap: 1rem;
      ">
        ${isUserLoggedIn ? `
          <div class="user-menu" style="position: relative;">
            <div class="user-avatar" onclick="toggleUserDropdown()" style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: linear-gradient(135deg, #009688, #4db6ac);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 600;
              cursor: pointer;
            ">
              ${userInfo && userInfo.username ? userInfo.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div class="user-dropdown" id="userDropdown" style="
              position: absolute;
              top: 100%;
              right: 0;
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              padding: 0.5rem 0;
              min-width: 150px;
              display: none;
            ">
              <a href="dashboard_user.html" style="
                display: block;
                padding: 8px 16px;
                color: #333;
                text-decoration: none;
              ">Dashboard</a>
              <a href="edit_profile.html" style="
                display: block;
                padding: 8px 16px;
                color: #333;
                text-decoration: none;
              ">Edit Profile</a>
              <hr style="margin: 4px 0; border: none; border-top: 1px solid #eee;">
              <a href="#" onclick="logout()" style="
                display: block;
                padding: 8px 16px;
                color: #333;
                text-decoration: none;
              ">Logout</a>
            </div>
          </div>
        ` : `
          <a href="login.html" style="
            padding: 8px 16px;
            color: #009688;
            text-decoration: none;
            border: 2px solid #009688;
            border-radius: 6px;
            font-weight: 500;
          ">Login</a>
          <a href="register.html" style="
            padding: 8px 16px;
            background: #009688;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
          ">Daftar</a>
        `}
      </div>
    </nav>
  `;
  
  console.log('Navbar rendered successfully!');
}

// Toggle user dropdown
function toggleUserDropdown() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  }
}

// Logout function
function logout() {
  if (confirm('Yakin ingin logout?')) {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const userMenu = document.querySelector('.user-menu');
  const dropdown = document.getElementById('userDropdown');
  
  if (dropdown && userMenu && !userMenu.contains(e.target)) {
    dropdown.style.display = 'none';
  }
}); 