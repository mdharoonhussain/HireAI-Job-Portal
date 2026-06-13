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

let allApplicants = [];

async function getApplicants() {
  try {
    const response = await fetch(
      `https://hireai-job-portal.onrender.com/api/applications/job/${jobId}?t=${Date.now()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (data.success) {
      console.log(
        "APPLICATIONS RECEIVED:",
        JSON.stringify(data.applications, null, 2),
      );
      allApplicants = data.applications;
      displayApplicants(allApplicants);
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

  // Remove broken applications where candidate is null
  const validApplications = applications.filter(
    (application) => application.candidate,
  );

  if (validApplications.length === 0) {
    applicantsContainer.innerHTML = `
      <div class="applicant-card">
        <h3>No Applicants Yet</h3>
      </div>
    `;
    return;
  }

  validApplications.forEach((application) => {
    const candidate = application.candidate;

    const card = document.createElement("div");

    card.classList.add("applicant-card");

    card.innerHTML = `
      <h3>${candidate.name}</h3>

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

        ${candidate.resumeUrl
        ? `
          <a
            href="${candidate.resumeUrl}"
            target="_blank"
            rel="noopener noreferrer"
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
  const originalStatusMap = {};
  allApplicants.forEach((app) => {
    originalStatusMap[app._id] = app.status;
  });

  try {
    console.log("Application ID:", applicationId);
    console.log("Status:", status);

    // Optimistically update status in UI immediately
    const applicant = allApplicants.find((app) => app._id === applicationId);
    if (applicant) {
      applicant.status = status;
      displayApplicants(allApplicants);
    }

    const response = await fetch(
      `https://hireai-job-portal.onrender.com/api/applications/${applicationId}/status`,
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

      await getApplicants();
    } else {
      showToast(data.message, "error");

      // Revert optimistic update
      const appToRevert = allApplicants.find((app) => app._id === applicationId);
      if (appToRevert) {
        appToRevert.status = originalStatusMap[applicationId];
        displayApplicants(allApplicants);
      }
    }
  } catch (error) {
    console.log(error);

    showToast("Something went wrong", "error");

    // Revert optimistic update
    const appToRevert = allApplicants.find((app) => app._id === applicationId);
    if (appToRevert) {
      appToRevert.status = originalStatusMap[applicationId];
      displayApplicants(allApplicants);
    }
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
