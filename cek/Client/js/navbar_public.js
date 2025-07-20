// CleanEarth - Modern Navbar JavaScript

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

// Render modern navbar
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
    <nav class="navbar">
      <div class="nav-logo" onclick="window.location.href='index.html'">
        <img src="assets/bumi.png" alt="CleanEarth Logo" onerror="this.style.display='none'">
        <span>CleanEarth</span>
      </div>
      
      <div class="nav-toggle" id="navToggle" onclick="toggleNav()">
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <div class="nav-links" id="navLinks">
        <a href="index.html"${active === 'home' ? ' class="active"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Home
        </a>
        <a href="dokumentasi.html"${active === 'dokumentasi' ? ' class="active"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Dokumentasi
        </a>
        <a href="event_guest.html"${active === 'event' ? ' class="active"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Event
        </a>
        ${isUserLoggedIn ? `
          <a href="my_events.html"${active === 'my-events' ? ' class="active"' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
              <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
              <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"></path>
              <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"></path>
            </svg>
            Event Saya
          </a>
        ` : ''}
      </div>
      
      <div class="nav-auth">
        ${isUserLoggedIn ? `
          <div class="user-menu">
            <div class="user-avatar" onclick="toggleUserDropdown()">
              ${userInfo && userInfo.username ? userInfo.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div class="user-dropdown" id="userDropdown">
              <a href="dashboard_user.html">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Dashboard
              </a>
              <a href="edit_profile.html">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Profile
              </a>
              <div class="divider"></div>
              <a href="#" onclick="logout()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </a>
            </div>
          </div>
        ` : `
          <a href="login.html" class="auth-btn login">Login</a>
          <a href="register.html" class="auth-btn register">Daftar</a>
        `}
      </div>
    </nav>
  `;
  
  // Add scroll effect
  addScrollEffect();
}

// Toggle mobile navigation
function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  
  navLinks.classList.toggle('show');
  navToggle.classList.toggle('active');
}

// Toggle user dropdown
function toggleUserDropdown() {
  const dropdown = document.getElementById('userDropdown');
  dropdown.style.opacity = dropdown.style.opacity === '1' ? '0' : '1';
  dropdown.style.visibility = dropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
  dropdown.style.transform = dropdown.style.transform === 'translateY(0px)' ? 'translateY(-10px)' : 'translateY(0px)';
}

// Add scroll effect to navbar
function addScrollEffect() {
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Logout function
function logout() {
  if (confirm('Yakin ingin logout?')) {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  
  if (navLinks && navLinks.classList.contains('show')) {
    if (!e.target.closest('.navbar')) {
      navLinks.classList.remove('show');
      navToggle.classList.remove('active');
    }
  }
});

// Close user dropdown when clicking outside
document.addEventListener('click', (e) => {
  const userMenu = document.querySelector('.user-menu');
  const dropdown = document.getElementById('userDropdown');
  
  if (dropdown && userMenu && !userMenu.contains(e.target)) {
    dropdown.style.opacity = '0';
    dropdown.style.visibility = 'hidden';
    dropdown.style.transform = 'translateY(-10px)';
  }
}); 