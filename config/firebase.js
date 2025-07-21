const admin = require("firebase-admin");

let firebaseConfig;

if (process.env.FIREBASE_CONFIG) {
  firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
} else {
  firebaseConfig = require("./credentials.json");
}

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

module.exports = admin;
