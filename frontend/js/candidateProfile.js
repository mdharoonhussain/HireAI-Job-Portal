const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
}

const profileForm = document.getElementById("profileForm");

const profileImage = document.getElementById("profileImage");

const profilePhotoInput = document.getElementById("profilePhotoInput");

const resumeInput = document.getElementById("resumeInput");

const viewResumeBtn = document.getElementById("viewResumeBtn");

async function loadProfile() {
  try {
    const response = await fetch(
      `https://hireai-job-portal.onrender.com/api/users/profile?t=${Date.now()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (data.success) {
      const user = data.user;

      document.getElementById("name").value = user.name || "";

      document.getElementById("email").value = user.email || "";

      document.getElementById("phone").value = user.phone || "";

      document.getElementById("location").value = user.location || "";

      document.getElementById("education").value = user.education || "";

      document.getElementById("experience").value = user.experience || "";

      document.getElementById("skills").value = user.skills?.join(", ") || "";

      if (user.profilePhoto) {
        console.log("Profile Photo URL:", user.profilePhoto);
        profileImage.src = user.profilePhoto;
      }

      if (user.resumeUrl) {
        viewResumeBtn.style.display = "inline-block";

        if (user.resumeUrl.startsWith("http")) {
          viewResumeBtn.href = user.resumeUrl;
        } else {
          viewResumeBtn.href = `https://hireai-job-portal.onrender.com${user.resumeUrl}`;
        }
      }
    }
  } catch (error) {
    console.log(error);

    showToast("Failed to load profile", "error");
  }
}

profileForm.addEventListener("submit", updateProfile);

async function updateProfile(e) {
  e.preventDefault();

  try {
    const response = await fetch(
      "https://hireai-job-portal.onrender.com/api/users/profile",
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: document.getElementById("name").value,

          phone: document.getElementById("phone").value,

          location: document.getElementById("location").value,

          education: document.getElementById("education").value,

          experience: document.getElementById("experience").value,

          skills: document
            .getElementById("skills")
            .value.split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== ""),
        }),
      },
    );

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

profilePhotoInput.addEventListener("change", uploadPhoto);

async function uploadPhoto() {
  try {
    const formData = new FormData();

    formData.append("profilePhoto", profilePhotoInput.files[0]);

    const response = await fetch(
      "https://hireai-job-portal.onrender.com/api/users/upload-photo",
      {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      },
    );

    const data = await response.json();

    if (data.success) {
      showToast("Photo uploaded successfully", "success");

      loadProfile();
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Photo upload failed", "error");
  }
}

resumeInput.addEventListener("change", uploadResume);

async function uploadResume() {
  try {
    const formData = new FormData();

    formData.append("resume", resumeInput.files[0]);

    const response = await fetch(
      "https://hireai-job-portal.onrender.com/api/users/upload-resume",
      {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      },
    );

    const data = await response.json();

    if (data.success) {
      showToast("Resume uploaded successfully", "success");

      loadProfile();
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Resume upload failed", "error");
  }
}

const imageModal = document.getElementById("imageModal");

const fullImage = document.getElementById("fullImage");

const closeImage = document.getElementById("closeImage");

profileImage.addEventListener("click", () => {
  fullImage.src = profileImage.src;

  imageModal.style.display = "block";
});

closeImage.addEventListener("click", () => {
  imageModal.style.display = "none";
});

imageModal.addEventListener("click", (e) => {
  if (e.target === imageModal) {
    imageModal.style.display = "none";
  }
});

loadProfile();

initializeLogout();

// Change Password Modal Functionality
const changePasswordModal = document.getElementById("changePasswordModal");
const openChangePasswordBtn = document.getElementById("openChangePasswordBtn");
const cancelChangePassword = document.getElementById("cancelChangePassword");
const changePasswordForm = document.getElementById("changePasswordForm");
const currentPasswordInput = document.getElementById("currentPassword");
const newPasswordInput = document.getElementById("newPassword");
const confirmNewPasswordInput = document.getElementById("confirmNewPassword");
const passwordMatchMessage = document.getElementById("passwordMatchMessage");

if (
  openChangePasswordBtn &&
  changePasswordModal &&
  cancelChangePassword &&
  changePasswordForm
) {
  openChangePasswordBtn.addEventListener("click", () => {
    changePasswordModal.classList.add("show");
  });

  const closeModal = () => {
    changePasswordModal.classList.remove("show");
    changePasswordForm.reset();
    passwordMatchMessage.textContent = "";
  };

  cancelChangePassword.addEventListener("click", closeModal);

  changePasswordModal.addEventListener("click", (e) => {
    if (e.target === changePasswordModal) {
      closeModal();
    }
  });

  const checkPasswordMatch = () => {
    const newPass = newPasswordInput.value;
    const confirmPass = confirmNewPasswordInput.value;

    if (!confirmPass) {
      passwordMatchMessage.textContent = "";
      return;
    }

    if (newPass === confirmPass) {
      passwordMatchMessage.textContent = "✓ Passwords Match";
      passwordMatchMessage.style.color = "#16a34a";
    } else {
      passwordMatchMessage.textContent = "✗ Passwords Do Not Match";
      passwordMatchMessage.style.color = "#dc2626";
    }
  };

  newPasswordInput.addEventListener("input", checkPasswordMatch);
  confirmNewPasswordInput.addEventListener("input", checkPasswordMatch);

  changePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const currentPass = currentPasswordInput.value;
    const newPass = newPasswordInput.value;
    const confirmPass = confirmNewPasswordInput.value;

    if (!currentPass || !newPass || !confirmPass) {
      showToast("All password fields are required", "error");
      return;
    }

    if (newPass !== confirmPass) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (newPass.length < 6) {
      showToast("New password must be at least 6 characters long", "error");
      return;
    }

    if (!/^[A-Z]/.test(newPass)) {
      showToast("New password must start with a Capital Letter (A-Z)", "error");
      return;
    }

    if (!/[a-z]/.test(newPass)) {
      showToast(
        "New password must contain at least one lowercase letter (a-z)",
        "error",
      );
      return;
    }

    if (!/[0-9]/.test(newPass)) {
      showToast("New password must contain at least one number (0-9)", "error");
      return;
    }

    if (!/[@#$%^&+=!*()_\-\[\]{}|;:',./<>?~`]/.test(newPass)) {
      showToast(
        "New password must contain at least one special character (@, #, $, %, &, etc.)",
        "error",
      );
      return;
    }

    if (/\s/.test(newPass)) {
      showToast("Spaces are not allowed in the new password", "error");
      return;
    }

    try {
      console.log("CHANGE PASSWORD CLICKED");
      console.log("URL:");
      console.log(
        "https://hireai-job-portal.onrender.com/api/users/change-password",
      );
      console.log("TOKEN:", token);

      const response = await fetch(
        "https://hireai-job-portal.onrender.com/api/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: currentPass,
            newPassword: newPass,
            confirmPassword: confirmPass,
          }),
        },
      );

      console.log("STATUS:", response.status);
      const data = await response.json();
      console.log("API RESPONSE:", data);

      if (data.success) {
        showToast("Password updated successfully", "success");
        closeModal();
      } else {
        showToast(data.message || "Failed to update password", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Something went wrong", "error");
    }
  });
}
