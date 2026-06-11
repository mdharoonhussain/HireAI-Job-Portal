const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
}

async function loadProfile() {
  try {
    const response = await fetch("http://localhost:5000/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      const user = data.user;

      document.getElementById("name").value = user.name || "";

      document.getElementById("email").value = user.email || "";

      document.getElementById("phone").value = user.phone || "";

      document.getElementById("companyName").value = user.companyName || "";

      document.getElementById("companyWebsite").value =
        user.companyWebsite || "";

      document.getElementById("companyLocation").value =
        user.companyLocation || "";

      document.getElementById("companyDescription").value =
        user.companyDescription || "";
    }
  } catch (error) {
    console.log(error);

    showToast("Failed to load profile", "error");
  }
}

document
  .getElementById("saveProfileBtn")
  .addEventListener("click", updateProfile);

async function updateProfile() {
  try {
    const response = await fetch("http://localhost:5000/api/users/profile", {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        name: document.getElementById("name").value,

        phone: document.getElementById("phone").value,

        companyName: document.getElementById("companyName").value,

        companyWebsite: document.getElementById("companyWebsite").value,

        companyLocation: document.getElementById("companyLocation").value,

        companyDescription: document.getElementById("companyDescription").value,
      }),
    });

    const data = await response.json();

    if (data.success) {
      showToast("Profile updated successfully", "success");
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Something went wrong", "error");
  }
}

loadProfile();
initializeLogout();
