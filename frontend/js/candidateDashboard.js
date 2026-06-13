const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
}

async function loadProfile() {
  try {
    const response = await fetch(
      `https://hireai-job-portal.onrender.com/api/users/profile?t=${Date.now()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    document.getElementById("welcomeText").innerText =
      `Welcome, ${data.user.name} 👋`;
  } catch (error) {
    console.log(error);
  }
}


const logoutBtn = document.getElementById("logoutBtn");

const logoutModal = document.getElementById("logoutModal");

const confirmLogout = document.getElementById("confirmLogout");

const cancelLogout = document.getElementById("cancelLogout");

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


loadProfile();