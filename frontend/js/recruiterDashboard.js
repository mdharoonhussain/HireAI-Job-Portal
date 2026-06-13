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

    if (data.success) {
      document.getElementById("welcomeText").textContent =
        `Welcome, ${data.user.name} 👋`;
    }
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

async function getRecruiterStats() {
  try {
    const response = await fetch(
      `https://hireai-job-portal.onrender.com/api/applications/recruiter/stats?t=${Date.now()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (data.success) {
      document.getElementById("totalJobs").textContent = data.stats.totalJobs;

      document.getElementById("totalApplications").textContent =
        data.stats.totalApplications;

      document.getElementById("totalShortlisted").textContent =
        data.stats.shortlisted;

      document.getElementById("totalHired").textContent = data.stats.hired;
    }
  } catch (error) {
    console.log(error);
  }
}

confirmLogout.addEventListener("click", () => {
  showToast("Logged out successfully", "success");

  setTimeout(() => {
    localStorage.clear();

    window.location.href = "../login.html";
  }, 1500);
});

initializeLogout();
loadProfile();
getRecruiterStats();
