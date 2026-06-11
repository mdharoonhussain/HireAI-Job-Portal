const jobsContainer = document.getElementById("jobsContainer");

const token = localStorage.getItem("token");

let selectedJobId = null;

/* Redirect if not logged in */

if (!token) {
  window.location.href = "../login.html";
}

/* Delete Modal */

const deleteModal = document.getElementById("deleteModal");

const cancelDelete = document.getElementById("cancelDelete");

const confirmDelete = document.getElementById("confirmDelete");

function openDeleteModal(jobId) {
  selectedJobId = jobId;

  deleteModal.classList.add("show");
}

cancelDelete.addEventListener("click", () => {
  deleteModal.classList.remove("show");

  selectedJobId = null;
});

confirmDelete.addEventListener("click", async () => {
  try {
    const response = await fetch(
      `https://hireai-job-portal.onrender.com/api/jobs/${selectedJobId}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (data.success) {
      deleteModal.classList.remove("show");

      selectedJobId = null;

      showToast("Job deleted successfully", "success");

      getMyJobs();
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Something went wrong", "error");
  }
});

/* Get Recruiter Jobs */

async function getMyJobs() {
  try {
    const response = await fetch(
      "https://hireai-job-portal.onrender.com/api/jobs/recruiter/jobs",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (data.success) {
      displayJobs(data.jobs);
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Failed to load jobs", "error");
  }
}

/* Display Jobs */

function displayJobs(jobs) {
  jobsContainer.innerHTML = "";

  if (jobs.length === 0) {
    jobsContainer.innerHTML = `
      <div class="job-card">
        <h3>No Jobs Posted Yet</h3>
      </div>
    `;
    return;
  }

  jobs.forEach((job) => {
    const card = document.createElement("div");

    card.classList.add("job-card");

    card.innerHTML = `
      <h3>${job.title}</h3>

      <p>
        <strong>Company:</strong>
        ${job.company}
      </p>

      <p>
        <strong>Location:</strong>
        ${job.location}
      </p>

      <p>
        <strong>Salary:</strong>
        ${job.salary}
      </p>

      <p>
        <strong>Description:</strong>
        ${job.description}
      </p>

      <p>
        <strong>Skills:</strong>
        ${job.skills.join(", ")}
      </p>

      <div class="job-actions">

        <button
          class="edit-btn"
          onclick="editJob('${job._id}')"
        >
          Edit
        </button>

        <button
          class="delete-btn"
          onclick="openDeleteModal('${job._id}')"
        >
          Delete
        </button>

        <button
          class="applicants-btn"
          onclick="viewApplicants('${job._id}')"
        >
          View Applicants
        </button>

      </div>
    `;

    jobsContainer.appendChild(card);
  });
}

/* Edit Job */

function editJob(jobId) {
  localStorage.setItem("editJobId", jobId);

  window.location.href = "edit-job.html";
}

/* View Applicants */

function viewApplicants(jobId) {
  console.log("Clicked Job ID:", jobId);

  localStorage.setItem("jobId", jobId);

  console.log("Stored Job ID:", localStorage.getItem("jobId"));

  window.location.href = "applicants.html";
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

/* Initial Load */

getMyJobs();
initializeLogout();
