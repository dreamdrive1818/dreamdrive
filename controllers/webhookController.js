const db = require("../config/firebase");
const axios = require("axios");
const { fetchAttachmentsFromZoho } = require("../utils/zohoFiles");

const uploadToCloudinary = async (fileUrl, folder, fileName) => {
  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        file: fileUrl,
        upload_preset: process.env.REACT_APP_CLOUDINARY_PRESET,
        folder,
        public_id: fileName,
      }
    );
    return res.data.secure_url;
  } catch (err) {
    console.error(`❌ Cloudinary upload failed for ${fileUrl}:`, err.message);
    return null;
  }
};

const handleWebhook = async (req, res) => {
  try {
    const data = req.body;
    console.log("📩 Webhook received:", data);

    const docId = data.email || `entry_${Date.now()}`;
    const folderName = `${data.fname || "user"}_${data.lname || "unknown"}`.replace(/\s+/g, "_");
    const recordId = data.record_id;

    // Fetch attachments from Zoho
    const attachments = await fetchAttachmentsFromZoho(recordId);
    const fileLinks = {};

    for (const file of attachments) {
      const cloudUrl = await uploadToCloudinary(file.download_link, folderName, file.file_name);
      if (cloudUrl) {
        if (!fileLinks[file.field_label]) fileLinks[file.field_label] = [];
        fileLinks[file.field_label].push(cloudUrl);
      }
    }

    await db.collection("form_entries").doc(docId).set({
      ...data,
      ...fileLinks,
      timestamp: new Date().toISOString(),
    });

    res.status(200).send("✅ Data and files saved");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("❌ Something went wrong");
  }
};

module.exports = { handleWebhook };
