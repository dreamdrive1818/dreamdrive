const express = require("express");
const { extractZohoImages } = require("../controllers/extractZohoImages");

const router = express.Router();

router.post("/zoho-image-extraction", extractZohoImages);

module.exports = router;
