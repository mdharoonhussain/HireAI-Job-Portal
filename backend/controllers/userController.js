const User = require("../models/User");

// Get Profile
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.education = req.body.education || user.education;
    user.experience = req.body.experience || user.experience;
    user.location = req.body.location || user.location;
    user.skills = req.body.skills || user.skills;
    user.companyName = req.body.companyName || user.companyName;

    user.companyWebsite = req.body.companyWebsite || user.companyWebsite;

    user.companyDescription =
      req.body.companyDescription || user.companyDescription;

    user.companyLocation = req.body.companyLocation || user.companyLocation;

    const updatedUser = await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.profilePhoto = req.file.path;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully",
      profilePhoto: user.profilePhoto,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const uploadResumeFile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.resumeUrl = req.file.path;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl: user.resumeUrl,
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
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  uploadResumeFile,
};
