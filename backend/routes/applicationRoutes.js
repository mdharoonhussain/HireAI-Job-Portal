const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");

router.post("/:jobId", protect, applyForJob);
router.get("/my-applications", protect, getMyApplications);
router.get("/job/:jobId", protect, getApplicantsForJob);
router.put("/:applicationId/status", protect, updateApplicationStatus);

module.exports = router;
