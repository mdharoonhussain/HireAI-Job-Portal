const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hireai-profile-photos",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hireai-resumes",
    resource_type: "raw",
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
