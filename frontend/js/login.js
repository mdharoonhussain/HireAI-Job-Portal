const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      showToast("Login Successful", "success");

      setTimeout(() => {
        if (data.user.role === "candidate") {
          window.location.href = "./candidate/dashboard.html";
        } else {
          window.location.href = "./recruiter/dashboard.html";
        }
      }, 1500);
    } else {
      showToast(data.message || "Invalid Credentials", "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Something went wrong. Please try again.", "error");
  }
});
