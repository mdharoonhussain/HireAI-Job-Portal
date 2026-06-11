const token = localStorage.getItem("token");

const jobId = localStorage.getItem("editJobId");

if (!token) {
  window.location.href = "../login.html";
}

async function loadJob() {
  try {
    const response = await fetch("http://localhost:5000/api/jobs/my-jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      const job = data.jobs.find((job) => job._id === jobId);

      if (!job) return;

      document.getElementById("title").value = job.title;

      document.getElementById("company").value = job.company;

      document.getElementById("location").value = job.location;

      document.getElementById("salary").value = job.salary;

      document.getElementById("description").value = job.description;

      document.getElementById("skills").value = job.skills.join(",");
    }
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("jobForm").addEventListener("submit", updateJob);

async function updateJob(e) {
  e.preventDefault();

  try {
    const title = document.getElementById("title").value.trim();

    const company = document.getElementById("company").value.trim();

    const location = document.getElementById("location").value.trim();

    const salary = document.getElementById("salary").value.trim();

    const description = document.getElementById("description").value.trim();

    const skills = document.getElementById("skills").value.trim();

    const updateData = {};

    if (title) updateData.title = title;

    if (company) updateData.company = company;

    if (location) updateData.location = location;

    if (salary) updateData.salary = salary;

    if (description) updateData.description = description;

    if (skills) {
      updateData.skills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");
    }

    const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (data.success) {
      showToast("Job updated successfully", "success");

      setTimeout(() => {
        window.location.href = "my-jobs.html";
      }, 1500);
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Something went wrong", "error");
  }
}

loadJob();

initializeLogout();
