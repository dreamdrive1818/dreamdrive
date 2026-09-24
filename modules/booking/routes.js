const express = require("express");
const admin = require("firebase-admin");
const FieldValue = admin.firestore.FieldValue;
const docs = require("../../shared/docs");

const router = express.Router();

async function syncUserOrder(email, previous, next) {
  if (!email) return;
  const userRef = docs.db.collection("users").doc(email);
  if (previous) {
    await userRef.update({ orders: FieldValue.arrayRemove(previous) });
  }
  if (next) {
    await userRef.set({ orders: FieldValue.arrayUnion(next) }, { merge: true });
  }
}

router.get("/orders", async (_req, res) => {
  try {
    res.json(await docs.listCollection("orders"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/orders/latest", async (_req, res) => {
  try {
    const snap = await docs.db
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();
    res.json(snap.docs.map(docs.serializeDoc));
  } catch (err) {
    try {
      const all = await docs.listCollection("orders");
      all.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
      res.json(all.slice(0, 5));
    } catch (inner) {
      res.status(500).json({ message: inner.message });
    }
  }
});

router.get("/track/:publicId", async (req, res) => {
  try {
    const snap = await docs.db
      .collection("orders")
      .where("id", "==", req.params.publicId)
      .get();
    if (snap.empty) return res.status(404).json({ message: "Not found" });
    res.json(docs.serializeDoc(snap.docs[0]));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const order = req.body;
    if (!order?.id) return res.status(400).json({ message: "Order id required" });
    await docs.setDoc("orders", order.id, order);
    const email = order.user?.email;
    if (email) {
      await docs.db.collection("users").doc(email).set(
        { orders: FieldValue.arrayUnion(order) },
        { merge: true }
      );
    }
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/orders/:id", async (req, res) => {
  try {
    const updated = await docs.updateDoc("orders", req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const current = await docs.getDoc("orders", req.params.id);
    if (!current) return res.status(404).json({ message: "Ride not found" });
    const { id, ...rideData } = current;
    const updatedRide = { ...rideData, status };
    await docs.updateDoc("orders", req.params.id, { status });
    await syncUserOrder(rideData.user?.email, rideData, updatedRide);
    res.json({ id, ...updatedRide });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/orders/:id/payment", async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const current = await docs.getDoc("orders", req.params.id);
    if (!current) return res.status(404).json({ message: "Ride not found" });
    const { id, ...rideData } = current;
    const updatedRide = { ...rideData, paymentStatus };
    await docs.updateDoc("orders", req.params.id, { paymentStatus });
    await syncUserOrder(rideData.user?.email, rideData, updatedRide);
    res.json({ id, ...updatedRide });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    const current = await docs.getDoc("orders", req.params.id);
    if (!current) return res.status(404).json({ message: "Ride not found" });
    const { id, ...rideData } = current;
    await syncUserOrder(rideData.user?.email, rideData, null);
    await docs.deleteDoc("orders", req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
