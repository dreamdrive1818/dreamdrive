const db = require("../config/firebase");

const handleWebhook = async (req, res) => {
  try {
    const data = req.body;
    console.log("Webhook data:", data);

    const docId = data.Email || `entry_${Date.now()}`;

    await db.collection("form_entries").doc(docId).set({
      ...data,
      timestamp: new Date().toISOString(),
    });

    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};

module.exports = { handleWebhook };
