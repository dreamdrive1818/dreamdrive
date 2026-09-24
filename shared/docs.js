const db = require("../config/firebase");

function toJson(value) {
  if (value == null) return value;
  if (typeof value.toDate === "function") {
    return {
      seconds: value.seconds,
      nanoseconds: value.nanoseconds,
    };
  }
  if (Array.isArray(value)) return value.map(toJson);
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = toJson(v);
    return out;
  }
  return value;
}

function serializeDoc(doc) {
  return { id: doc.id, ...toJson(doc.data()) };
}

async function listCollection(name) {
  const snap = await db.collection(name).get();
  return snap.docs.map(serializeDoc);
}

async function getDoc(name, id) {
  const snap = await db.collection(name).doc(id).get();
  if (!snap.exists) return null;
  return serializeDoc(snap);
}

async function addDoc(name, data) {
  const ref = await db.collection(name).add(data);
  const snap = await ref.get();
  return serializeDoc(snap);
}

async function setDoc(name, id, data, merge = false) {
  await db.collection(name).doc(id).set(data, { merge });
  return getDoc(name, id);
}

async function updateDoc(name, id, data) {
  await db.collection(name).doc(id).update(data);
  return getDoc(name, id);
}

async function deleteDoc(name, id) {
  await db.collection(name).doc(id).delete();
}

module.exports = {
  db,
  toJson,
  serializeDoc,
  listCollection,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
};
