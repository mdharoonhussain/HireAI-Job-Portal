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

const resumeStorage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "hireai-resumes",

    resource_type: "raw",

    public_id: Date.now() + "-" + path.parse(file.originalname).name,

    format: "pdf",
  }),
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
