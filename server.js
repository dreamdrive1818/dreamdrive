require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const express = require("express");
const { createMonolith, applyBase, mountCms } = require("./app");
const { mountGatewayProxies } = require("./gateway/proxies");

const port = Number(process.env.PORT) || 5000;
const host = process.env.HOST || "0.0.0.0";
const mode = process.env.RUN_MODE || "monolith";

let app;

if (mode === "split") {
  app = express();
  applyBase(app);
  mountCms(app);
  mountGatewayProxies(app);
  app.get("/health", (_req, res) => res.json({ ok: true, mode: "gateway" }));
} else {
  app = createMonolith();
}

app.listen(port, host, () => {
  console.log(`DreamDrive API (${mode}) on http://${host}:${port}`);
});
