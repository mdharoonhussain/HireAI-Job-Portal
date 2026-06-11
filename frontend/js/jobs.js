const jobsContainer = document.getElementById("jobsContainer");

const token = localStorage.getItem("token");

let allJobs = [];

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

    console.log("Response:", response);
    const data = await response.json();
    console.log("Data:", data);

    if (data.success) {
      allJobs = data.jobs;

      loadLocationFilter();

      displayJobs(allJobs);
    }
  } catch (error) {
    console.log(error);
  }
}

function displayJobs(jobs) {
  jobsContainer.innerHTML = "";
  console.log("Applied Jobs Array:", appliedJobs);

  jobs.forEach((job) => {
    console.log("Current Job:", job._id);
    console.log("Already Applied:", appliedJobs.includes(job._id.toString()));
    const card = document.createElement("div");

    card.classList.add("job-card");

    const alreadyApplied = appliedJobs.includes(job._id.toString());

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
  try {
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
      appliedJobs = data.applications
        .filter((app) => app.job)
        .map((app) => app.job._id);

      console.log("Applied Jobs:", appliedJobs);
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

confirmLogout.addEventListener("click", () => {
  showToast("Logged out successfully", "success");

  setTimeout(() => {
    localStorage.clear();

    window.location.href = "../login.html";
  }, 1500);
});

const searchInput = document.getElementById("searchInput");

const locationFilter = document.getElementById("locationFilter");

const skillFilter = document.getElementById("skillFilter");

const salaryFilter = document.getElementById("salaryFilter");

function loadLocationFilter() {
  const locations = [...new Set(allJobs.map((job) => job.location))];

  locations.forEach((location) => {
    const option = document.createElement("option");

    option.value = location;

    option.textContent = location;

    locationFilter.appendChild(option);
  });
}

function filterJobs() {
  const searchTerm = searchInput.value.toLowerCase();

  const selectedLocation = locationFilter.value.toLowerCase();

  const selectedSkill = skillFilter.value.toLowerCase();

  const selectedSalary = salaryFilter.value;

  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.location.toLowerCase().includes(searchTerm) ||
      job.skills.join(" ").toLowerCase().includes(searchTerm);

    const matchesLocation =
      !selectedLocation || job.location.toLowerCase() === selectedLocation;

    const matchesSkill =
      !selectedSkill ||
      job.skills.join(" ").toLowerCase().includes(selectedSkill);

    let matchesSalary = true;

    const salaryNumber = parseInt(job.salary);

    if (selectedSalary === "0-5") {
      matchesSalary = salaryNumber <= 5;
    } else if (selectedSalary === "5-10") {
      matchesSalary = salaryNumber > 5 && salaryNumber <= 10;
    } else if (selectedSalary === "10-20") {
      matchesSalary = salaryNumber > 10 && salaryNumber <= 20;
    } else if (selectedSalary === "20+") {
      matchesSalary = salaryNumber > 20;
    }

    return matchesSearch && matchesLocation && matchesSkill && matchesSalary;
  });

  displayJobs(filteredJobs);
}

searchInput.addEventListener("input", filterJobs);

locationFilter.addEventListener("change", filterJobs);

skillFilter.addEventListener("change", filterJobs);

salaryFilter.addEventListener("change", filterJobs);

getJobs();
