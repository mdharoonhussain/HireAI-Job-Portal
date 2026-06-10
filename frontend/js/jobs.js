const jobsContainer = document.getElementById("jobsContainer");

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
}

async function getJobs() {
  await getAppliedJobs();

  try {
    const response = await fetch("http://localhost:5000/api/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      displayJobs(data.jobs);
    }
  } catch (error) {
    console.log(error);
  }
}

function displayJobs(jobs) {
  jobsContainer.innerHTML = "";

  jobs.forEach((job) => {
    const card = document.createElement("div");

    card.classList.add("job-card");

    const alreadyApplied = appliedJobs.includes(job._id);

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

      <div class="skills">
        ${job.skills
          .map((skill) => `<span class="skill">${skill}</span>`)
          .join("")}
      </div>

      <div class="apply-container">

        ${
          alreadyApplied
            ? `
            <button
              class="applied-btn"
              disabled
            >
              Applied
            </button>
            `
            : `
            <button
              class="apply-btn"
              onclick="applyJob('${job._id}')"
            >
              Apply Now
            </button>
            `
        }

      </div>
    `;

    jobsContainer.appendChild(card);
  });
}

async function applyJob(jobId) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/applications/${jobId}`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (data.success) {
      showToast("Application submitted successfully", "success");
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Something went wrong", "error");
  }
}

let appliedJobs = [];

async function getAppliedJobs() {
  const response = await fetch(
    "http://localhost:5000/api/applications/my-applications",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (data.success) {
    appliedJobs = data.applications.map((app) => app.job._id);
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

getJobs();
