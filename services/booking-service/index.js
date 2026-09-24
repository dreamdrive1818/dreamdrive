require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const express = require("express");
const { applyBase, mountBooking } = require("../../app");

const app = express();
applyBase(app);
mountBooking(app);
app.get("/health", (_req, res) => res.json({ service: "booking" }));
app.listen(process.env.BOOKING_PORT || 5004, () => {
  console.log("booking-service up");
});
