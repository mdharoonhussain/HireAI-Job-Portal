const applicationsContainer = document.getElementById("applicationsContainer");

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
}

async function getApplications() {
  try {
    const response = await fetch(
      "https://hireai-job-portal.onrender.com/api/applications/my-applications",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (data.success) {
      displayApplications(data.applications);
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Failed to load applications", "error");
  }
}

function displayApplications(applications) {
  applicationsContainer.innerHTML = "";

  if (applications.length === 0) {
    applicationsContainer.innerHTML = `
      <div class="application-card">
        <h3>
          No Applications Found
        </h3>

        <p>
          You have not applied
          for any jobs yet.
        </p>
      </div>
    `;
    return;
  }

  applications.forEach((application) => {
    const card = document.createElement("div");

    card.classList.add("application-card");

    card.innerHTML = `
        <h3>
          ${application.job.title}
        </h3>

        <p>
          <strong>Company:</strong>
          ${application.job.company}
        </p>

        <p>
          <strong>Location:</strong>
          ${application.job.location}
        </p>

        <p>
          <strong>Status:</strong>
          <span
            class="status ${application.status}"
          >
            ${application.status}
          </span>
        </p>

        <p>
          <strong>Applied On:</strong>
          ${new Date(application.createdAt).toLocaleDateString()}
        </p>
      `;

    applicationsContainer.appendChild(card);
  });
}

/* Logout */

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

getApplications();
