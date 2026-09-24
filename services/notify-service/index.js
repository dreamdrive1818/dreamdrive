require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const express = require("express");
const { applyBase, mountNotify } = require("../../app");

const app = express();
applyBase(app);
mountNotify(app);
app.get("/health", (_req, res) => res.json({ service: "notify" }));
app.listen(process.env.NOTIFY_PORT || 5002, () => {
  console.log("notify-service up");
});
