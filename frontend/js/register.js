const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  try {
    const response = await fetch(
      "https://hireai-job-portal.onrender.com/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      },
    );

    const data = await response.json();

    if (data.success) {
      showToast(data.message || "Registration Successful", "success");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      showToast(data.message || "Registration Failed", "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Something went wrong. Please try again.", "error");
  }
});
