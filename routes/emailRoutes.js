const express = require("express");
const router = express.Router();

const otpController = require("../controllers/otpController");
const confirmationController = require("../controllers/confirmationController");

router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", otpController.verifyOtp);
router.post("/send-confirmation", confirmationController.sendConfirmation);

module.exports = router;
