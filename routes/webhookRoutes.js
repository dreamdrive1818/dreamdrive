const express = require("express");
const { handleWebhook } = require("../controllers/webhookController");

const router = express.Router();

router.post("/zoho-webhook", handleWebhook);

module.exports = router;
