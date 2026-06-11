const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
}

async function loadProfile() {
  try {
    const response = await fetch(
      "https://hireai-job-portal.onrender.com/api/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    document.getElementById("welcomeText").innerText =
      `Welcome, ${data.user.name} 👋`;
  } catch (error) {
    console.log(error);
  }
}

loadProfile();

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  showToast("Logged out successfully", "success");

  setTimeout(() => {
    window.location.href = "../login.html";
  }, 1500);
});
