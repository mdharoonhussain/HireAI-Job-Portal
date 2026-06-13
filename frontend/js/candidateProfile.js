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
