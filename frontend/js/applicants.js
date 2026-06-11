const applicantsContainer = document.getElementById("applicantsContainer");

const token = localStorage.getItem("token");

const jobId = localStorage.getItem("jobId");

if (!token) {
  window.location.href = "../login.html";
}

if (!jobId) {
  showToast("Job not found", "error");

  setTimeout(() => {
    window.location.href = "my-jobs.html";
  }, 1500);
}

console.log("Stored Job ID:", jobId);

async function getApplicants() {
  try {
    const response = await fetch(
      `http://localhost:5000/api/applications/job/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (data.success) {
      displayApplicants(data.applications);
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Failed to load applicants", "error");
  }
}

function displayApplicants(applications) {
  applicantsContainer.innerHTML = "";

  if (applications.length === 0) {
    applicantsContainer.innerHTML = `
      <div class="applicant-card">
        <h3>
          No Applicants Yet
        </h3>
      </div>
    `;
    return;
  }

  applications.forEach((application) => {
    const candidate = application.candidate;

    const card = document.createElement("div");

    card.classList.add("applicant-card");

    card.innerHTML = `
        <h3>
          ${candidate.name}
        </h3>

        <p>
          <strong>Email:</strong>
          ${candidate.email}
        </p>

        <p>
          <strong>Location:</strong>
          ${candidate.location || "N/A"}
        </p>

        <p>
          <strong>Experience:</strong>
          ${candidate.experience || "N/A"}
        </p>

        <p>
          <strong>Education:</strong>
          ${candidate.education || "N/A"}
        </p>

        <p>
          <strong>Skills:</strong>
          ${candidate.skills?.join(", ") || "N/A"}
        </p>

        <p>
          <strong>Status:</strong>
          <span class="status ${application.status}">
            ${application.status}
          </span>
        </p>

        <div class="applicant-actions">

          ${
            candidate.resumeUrl
              ? `
            <a
              href="http://localhost:5000${candidate.resumeUrl}"
              target="_blank"
            >
              <button class="resume-btn">
                Resume
              </button>
            </a>
          `
              : ""
          }

          <button
            class="shortlist-btn"
            onclick="updateStatus('${application._id}','shortlisted')"
          >
            Shortlist
          </button>

          <button
            class="reject-btn"
            onclick="updateStatus('${application._id}','rejected')"
          >
            Reject
          </button>

          <button
            class="hire-btn"
            onclick="updateStatus('${application._id}','hired')"
          >
            Hire
          </button>

        </div>
      `;

    applicantsContainer.appendChild(card);
  });
}

async function updateStatus(applicationId, status) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/applications/${applicationId}/status`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          status,
        }),
      },
    );

    const data = await response.json();

    if (data.success) {
      showToast(`Candidate ${status}`, "success");

      getApplicants();
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Something went wrong", "error");
  }
}

/* Logout Modal */

const logoutBtn = document.getElementById("logoutBtn");

const logoutModal = document.getElementById("logoutModal");

const cancelLogout = document.getElementById("cancelLogout");

const confirmLogout = document.getElementById("confirmLogout");

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

getApplicants();
initializeLogout();
