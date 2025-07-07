const admin = require("firebase-admin");
const serviceAccount = require("./dreamdrive-307ed-serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin.firestore();
