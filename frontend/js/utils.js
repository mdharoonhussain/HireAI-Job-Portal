function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function initializeLogout() {
  const logoutBtn = document.getElementById("logoutBtn");

  const logoutModal = document.getElementById("logoutModal");

  const cancelLogout = document.getElementById("cancelLogout");

  const confirmLogout = document.getElementById("confirmLogout");

  if (!logoutBtn || !logoutModal || !cancelLogout || !confirmLogout) {
    return;
  }

  logoutBtn.addEventListener("click", () => {
    logoutModal.classList.add("show");
  });

  cancelLogout.addEventListener("click", () => {
    logoutModal.classList.remove("show");
  });

  confirmLogout.addEventListener("click", () => {
    showToast("Logged out successfully", "success");

    setTimeout(() => {
      localStorage.clear();
      window.location.href = "../login.html";
    }, 1500);
  });
}
