const form = document.querySelector('.lapor-form');
const successMessage = document.getElementById('laporSuccess');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // Mencegah reload

  form.reset(); // Reset form
  successMessage.style.display = 'block';

  // Scroll agar pesan terlihat
  successMessage.scrollIntoView({ behavior: 'smooth' });

  // Setelah 5 detik, sembunyikan pesan dan redirect ke index.html
  setTimeout(() => {
    successMessage.style.display = 'none';
    window.location.href = 'index.html'; // Ganti sesuai halaman tujuanmu
  }, 5000);
});
