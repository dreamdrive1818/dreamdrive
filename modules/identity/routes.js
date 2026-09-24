const express = require("express");
const docs = require("../../shared/docs");
const admin = require("firebase-admin");
const FieldValue = admin.firestore.FieldValue;

const router = express.Router();

router.get("/admin/:uid", async (req, res) => {
  try {
    const adminDoc = await docs.getDoc("admin", req.params.uid);
    if (!adminDoc) return res.status(404).json({ message: "Admin not found" });
    res.json(adminDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/users", async (_req, res) => {
  try {
    res.json(await docs.listCollection("users"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await docs.getDoc("users", req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await docs.deleteDoc("users", req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/users/:id/orders", async (req, res) => {
  try {
    await docs.db.collection("users").doc(req.params.id).set(
      { orders: FieldValue.arrayUnion(req.body) },
      { merge: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/site-numbers/:id", async (req, res) => {
  try {
    const row = await docs.getDoc("siteNumbers", req.params.id);
    res.json(row || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
