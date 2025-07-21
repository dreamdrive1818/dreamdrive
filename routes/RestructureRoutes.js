const express = require("express");
const { updateParentFieldNames } = require("../controllers/restructureEntries");

const router = express.Router();

router.post("/rs-entries", updateParentFieldNames);

module.exports = router;
