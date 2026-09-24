const express = require("express");
const docs = require("../../shared/docs");

const router = express.Router();

router.get("/cars", async (_req, res) => {
  try {
    res.json(await docs.listCollection("cars"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/cars", async (req, res) => {
  try {
    res.status(201).json(await docs.addDoc("cars", req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/cars/:id", async (req, res) => {
  try {
    res.json(await docs.updateDoc("cars", req.params.id, req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/cars/:id", async (req, res) => {
  try {
    await docs.deleteDoc("cars", req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
