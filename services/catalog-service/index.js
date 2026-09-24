require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const express = require("express");
const { applyBase, mountCatalog } = require("../../app");

const app = express();
applyBase(app);
mountCatalog(app);
app.get("/health", (_req, res) => res.json({ service: "catalog" }));
app.listen(process.env.CATALOG_PORT || 5005, () => {
  console.log("catalog-service up");
});
