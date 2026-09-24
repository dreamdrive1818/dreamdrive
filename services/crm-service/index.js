require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const express = require("express");
const { applyBase, mountCrm } = require("../../app");

const app = express();
applyBase(app);
mountCrm(app);
app.get("/health", (_req, res) => res.json({ service: "crm" }));
app.listen(process.env.CRM_PORT || 5003, () => {
  console.log("crm-service up");
});
