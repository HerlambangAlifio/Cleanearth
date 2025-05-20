document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector('.gabung-form');
  const successMessage = document.getElementById('gabungSuccess');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    form.reset();
    successMessage.style.display = 'block';
    successMessage.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      successMessage.style.display = 'none';
      window.location.href = 'index.html';
    }, 5000);
  });
});
