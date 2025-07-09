const db = require("../config/firebase");
const { fetchAttachmentsFromZoho } = require("../utils/zohoFiles");
const { getRecordIdFromEmail } = require("../utils/getRecordIdFromEmail");

const handleWebhook = async (req, res) => {
  try {
    const data = req.body;
    console.log("📩 Webhook received:", data);

    const docId = data.email || `entry_${Date.now()}`;
    const folderName = `${data.fname || "user"}_${data.lname || "unknown"}`.replace(/\s+/g, "_");

    // 1. Get recordId from email
    const recordId = await getRecordIdFromEmail(data.email);
    if (!recordId) {
      console.error("❌ Record ID not found for email:", data.email);
      return res.status(404).send("Record ID not found");
    }

    // 2. Fetch attachments from Zoho
    const attachments = await fetchAttachmentsFromZoho(recordId);
    const fileLinks = {};

    // 3. Add file metadata to object (no Cloudinary upload)
    for (const file of attachments) {
      if (!fileLinks[file.field_label]) fileLinks[file.field_label] = [];
      fileLinks[file.field_label].push({
        file_name: file.file_name,
        download_link: file.download_link,
      });
    }

    // 4. Save to Firestore
    await db.collection("form_entries").doc(docId).set({
      ...data,
      ...fileLinks,
      record_id: recordId,
      timestamp: new Date().toISOString(),
    });

    res.status(200).send("✅ Data and file links saved to Firestore");
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.status(500).send("Something went wrong");
  }
};

module.exports = { handleWebhook };
