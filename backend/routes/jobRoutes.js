const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { authorizeRecruiter } = require("../middleware/roleMiddleware");

router.post("/", protect, authorizeRecruiter, createJob);
router.get("/", getAllJobs);
router.get("/:id", getSingleJob);
router.put("/:id", protect, authorizeRecruiter, updateJob);
router.delete("/:id", protect, authorizeRecruiter, deleteJob);

module.exports = router;
