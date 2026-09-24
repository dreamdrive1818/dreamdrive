require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const express = require("express");
const { applyBase, mountIdentity } = require("../../app");

const app = express();
applyBase(app);
mountIdentity(app);
app.get("/health", (_req, res) => res.json({ service: "identity" }));
app.listen(process.env.IDENTITY_PORT || 5001, () => {
  console.log("identity-service up");
});
