const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Custom Rules Verification
    if (!/^[A-Z]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "New password must start with a Capital Letter (A-Z)",
      });
    }

    if (!/[a-z]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least one lowercase letter (a-z)",
      });
    }

    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least one number (0-9)",
      });
    }

    if (!/[@#$%^&+=!*()_\-\[\]{}|;:',./<>?~`]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least one special character (@, #, $, %, &, etc.)",
      });
    }

    if (/\s/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Spaces are not allowed in the new password",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
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
  changePassword,
};
