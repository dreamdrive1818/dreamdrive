const express = require("express");
const { handleWebhook } = require("../../controllers/webhookController");
const docs = require("../../shared/docs");

const router = express.Router();

router.post("/zoho-webhook", handleWebhook);

router.get("/form-entries", async (_req, res) => {
  try {
    res.json(await docs.listCollection("form_entries"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/form-entries/:id", async (req, res) => {
  try {
    const entry = await docs.getDoc("form_entries", req.params.id);
    if (!entry) return res.status(404).json({ message: "Not found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/form-entries/:id", async (req, res) => {
  try {
    res.json(await docs.updateDoc("form_entries", req.params.id, req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/form-entries/:id", async (req, res) => {
  try {
    await docs.deleteDoc("form_entries", req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
