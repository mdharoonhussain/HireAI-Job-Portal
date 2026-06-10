const express = require("express");
const router = express.Router();

const sendEmail = require("../utils/sendEmail");

router.get("/send-email", async (req, res) => {
  try {
    await sendEmail({
      email: "haroonhussain97@gmail.com",
      subject: "HireAI Test Email",
      message: "Nodemailer is working successfully!",
    });

    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
