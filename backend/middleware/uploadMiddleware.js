const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hireai-profile-photos",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadImage = multer({
  storage: imageStorage,
});

const uploadResume = multer({
  storage: resumeStorage,
});

module.exports = {
  uploadImage,
  uploadResume,
};
