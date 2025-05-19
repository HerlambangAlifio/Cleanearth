document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("eventModal").style.display = "none";
});

document.getElementById("eventForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Pendaftaran berhasil dikirim!");
  this.reset(); // Kosongkan form
});
