const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { uploadImage, uploadResume } = require("../middleware/uploadMiddleware");

const {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  uploadResumeFile,
  changePassword,
} = require("../controllers/userController");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

router.put(
  "/upload-photo",
  protect,
  uploadImage.single("profilePhoto"),
  uploadProfilePhoto,
);

router.put(
  "/upload-resume",
  protect,
  uploadResume.single("resume"),
  uploadResumeFile,
);

module.exports = router;
