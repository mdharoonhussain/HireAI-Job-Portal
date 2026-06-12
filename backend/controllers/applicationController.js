const Application = require("../models/Application");
const Job = require("../models/Job");

// Apply for Job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Only candidates can apply
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can apply for jobs",
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId).populate("recruiter", "name email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check duplicate application
    const alreadyApplied = await Application.findOne({
      candidate: req.user._id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = await Application.create({
      candidate: req.user._id,
      job: jobId,
    });

    console.log("APPLICATION CREATED");

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });

    console.log("STEP 1 - APPLICATION CREATED");

    console.log("STEP 2 - SENDING RESPONSE");

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });

    console.log("STEP 3 - SHOULD NEVER RUN");
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user._id,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    const validApplications = applications.filter((app) => app.job);

    res.status(200).json({
      success: true,
      applications: validApplications,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Only recruiters allowed
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can view applicants",
      });
    }

    // Check job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Ownership check
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view applicants for your own jobs",
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate(
        "candidate",
        "name email profilePhoto resumeUrl skills education experience location",
      )
      .sort({ createdAt: -1 });

    const validApplications = applications.filter((app) => app.candidate);

    res.status(200).json({
      success: true,
      count: validApplications.length,
      applications: validApplications,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    console.log("UPDATE STATUS API HIT");
    const { applicationId } = req.params;
    const { status } = req.body;

    // Only recruiters can update status
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can update application status",
      });
    }

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("candidate", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Recruiter can update only own job applications
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own job applications",
      });
    }

    const validStatuses = ["pending", "shortlisted", "rejected", "hired"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be pending, shortlisted, rejected, or hired",
      });
    }

    application.status = status;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getRecruiterStats = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can access stats",
      });
    }

    const jobs = await Job.find({
      recruiter: req.user._id,
    });

    const jobIds = jobs.map((job) => job._id);

    const totalJobs = jobs.length;

    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    const shortlisted = await Application.countDocuments({
      job: { $in: jobIds },
      status: "shortlisted",
    });

    const hired = await Application.countDocuments({
      job: { $in: jobIds },
      status: "hired",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        totalApplications,
        shortlisted,
        hired,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  getRecruiterStats,
};
