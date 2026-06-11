const jobForm = document.getElementById("jobForm");

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
}

jobForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;

  const company = document.getElementById("company").value;

  const location = document.getElementById("location").value;

  const salary = document.getElementById("salary").value;

  const description = document.getElementById("description").value;

  const skills = document
    .getElementById("skills")
    .value.split(",")
    .map((skill) => skill.trim());

  try {
    const response = await fetch("http://localhost:5000/api/jobs", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        title,
        company,
        location,
        salary,
        description,
        skills,
      }),
    });

    const data = await response.json();

    if (data.success) {
      showToast("Job posted successfully", "success");

      jobForm.reset();

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
});

initializeLogout();
