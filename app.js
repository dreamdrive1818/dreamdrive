const express = require("express");
const cors = require("cors");

const identity = require("./modules/identity/routes");
const catalog = require("./modules/catalog/routes");
const booking = require("./modules/booking/routes");
const notify = require("./modules/notify/routes");
const crm = require("./modules/crm/routes");
const cms = require("./modules/cms/routes");

function applyBase(app) {
  app.use(cors());
  app.use(express.json({ limit: "12mb" }));
}

function mountIdentity(app) {
  app.use("/api/identity", identity);
}

function mountCatalog(app) {
  app.use("/api/catalog", catalog);
}

function mountBooking(app) {
  app.use("/api/booking", booking);
}

function mountNotify(app) {
  app.use("/api/notify", notify);
  app.use("/api", notify);
}

function mountCrm(app) {
  app.use("/api/crm", crm);
  app.use("/api", crm);
}

function mountCms(app) {
  app.use("/api/cms", cms);
}

function createMonolith() {
  const app = express();
  applyBase(app);
  mountIdentity(app);
  mountCatalog(app);
  mountBooking(app);
  mountNotify(app);
  mountCrm(app);
  mountCms(app);
  app.get("/health", (_req, res) => res.json({ ok: true, mode: "monolith" }));
  return app;
}

module.exports = {
  applyBase,
  mountIdentity,
  mountCatalog,
  mountBooking,
  mountNotify,
  mountCrm,
  mountCms,
  createMonolith,
};
