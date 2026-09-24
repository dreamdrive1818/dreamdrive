const express = require("express");
const docs = require("../../shared/docs");

const router = express.Router();

router.get("/blogs", async (_req, res) => {
  try {
    res.json(await docs.listCollection("_blogs"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/blogs/slug/:slug", async (req, res) => {
  try {
    const snap = await docs.db
      .collection("_blogs")
      .where("urlSlug", "==", req.params.slug)
      .get();
    if (snap.empty) return res.status(404).json({ message: "Not found" });
    res.json(docs.serializeDoc(snap.docs[0]));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/legacy-blogs", async (_req, res) => {
  try {
    res.json(await docs.listCollection("antivirus_blogs"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/blogs", async (req, res) => {
  try {
    res.status(201).json(await docs.addDoc("_blogs", req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/blogs/:id", async (req, res) => {
  try {
    res.json(
      await docs.updateDoc("_blogs", req.params.id, {
        ...req.body,
        updatedAt: new Date(),
      })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/blogs/:id", async (req, res) => {
  try {
    await docs.deleteDoc("_blogs", req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/blogs/:id/comments", async (req, res) => {
  try {
    const snap = await docs.db
      .collection("_blogs")
      .doc(req.params.id)
      .collection("comments")
      .get();
    res.json(snap.docs.map(docs.serializeDoc));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/blogs/:id/comments", async (req, res) => {
  try {
    const ref = await docs.db
      .collection("_blogs")
      .doc(req.params.id)
      .collection("comments")
      .add({ ...req.body, approved: false, createdAt: new Date() });
    const snap = await ref.get();
    res.status(201).json(docs.serializeDoc(snap));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/comments", async (_req, res) => {
  try {
    const snap = await docs.db.collectionGroup("comments").get();
    res.json(
      snap.docs.map((doc) => {
        const d = docs.serializeDoc(doc);
        return {
          ...d,
          path: doc.ref.path,
          approved:
            typeof d.approved === "string" ? d.approved === "true" : !!d.approved,
        };
      })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/comments", async (req, res) => {
  try {
    const { path, approved } = req.body;
    if (!path) return res.status(400).json({ message: "path required" });
    await docs.db.doc(path).update({ approved });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/categories", async (_req, res) => {
  try {
    res.json(await docs.listCollection("categories"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    const row = await docs.getDoc("categories", req.params.id);
    if (!row) return res.status(404).json({ message: "Category not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/categories/:id", async (req, res) => {
  try {
    res.json(await docs.setDoc("categories", req.params.id, req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/categories/:id", async (req, res) => {
  try {
    res.json(await docs.updateDoc("categories", req.params.id, req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    await docs.deleteDoc("categories", req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/categories/:oldId/rename", async (req, res) => {
  try {
    const { newId, name } = req.body;
    const old = await docs.getDoc("categories", req.params.oldId);
    if (!old) return res.status(404).json({ message: "Old category not found" });
    const { id, ...data } = old;
    await docs.setDoc("categories", newId, {
      ...data,
      name,
      updatedAt: new Date(),
    });
    await docs.deleteDoc("categories", req.params.oldId);
    res.json({ id: newId, name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/testimonials", async (_req, res) => {
  try {
    res.json(await docs.listCollection("testimonials"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/testimonials", async (req, res) => {
  try {
    res.status(201).json(
      await docs.addDoc("testimonials", {
        ...req.body,
        status: req.body.status || "pending",
        createdAt: new Date(),
      })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/testimonials/:id", async (req, res) => {
  try {
    res.json(await docs.updateDoc("testimonials", req.params.id, req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/testimonials/:id", async (req, res) => {
  try {
    await docs.deleteDoc("testimonials", req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/contacts", async (_req, res) => {
  try {
    res.json(await docs.listCollection("contacts"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/contacts", async (req, res) => {
  try {
    res.status(201).json(
      await docs.addDoc("contacts", { ...req.body, createdAt: new Date() })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/banners/:id", async (req, res) => {
  try {
    res.json(await docs.setDoc("banner_settings", req.params.id, req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/metadata/:pageId", async (req, res) => {
  try {
    res.json(
      await docs.setDoc("pageMetadata", req.params.pageId, {
        ...req.body,
        timestamp: new Date(),
      })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/media", async (_req, res) => {
  try {
    res.json(await docs.listCollection("media"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/media", async (req, res) => {
  try {
    res.status(201).json(await docs.addDoc("media", req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/media/:id", async (req, res) => {
  try {
    await docs.deleteDoc("media", req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
