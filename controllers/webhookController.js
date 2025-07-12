const db = require("../config/firebase");
const axios = require("axios");
const { fetchAttachmentsFromZoho } = require("../utils/zohoFiles");
const { getRecordIdFromEmail } = require("../utils/getRecordIdFromEmail");

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
    console.log("📩 Webhook received:", data.fname);

    const docId = data.email || `entry_${Date.now()}`;
    // const folderName = `${data.fname || "user"}_${data.lname || "unknown"}`.replace(/\s+/g, "_");

    // 1. Get recordId from email (since webhook does not include it)
    // const recordId = await getRecordIdFromEmail(data.email);
    // if (!recordId) {
    //   console.error("❌ Record ID not found for email:", data.email);
    //   return res.status(404).send("Record ID not found");
    // }

    // 2. Fetch attachments from Zoho
    // const attachments = await fetchAttachmentsFromZoho(recordId);
    // const fileLinks = {};

    // 3. Upload each file to Cloudinary and store link
    // for (const file of attachments) {
    //   const cloudUrl = await uploadToCloudinary(file.download_link, folderName, file.file_name);
    //   if (cloudUrl) {
    //     if (!fileLinks[file.field_label]) fileLinks[file.field_label] = [];
    //     fileLinks[file.field_label].push(cloudUrl);
    //   }
    // }

    // 4. Save to Firestore
    await db.collection("form_entries").doc(docId).set({
      ...data,
      timestamp: new Date().toISOString(),
    });

    res.status(200).send("✅ Data and files saved");
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.status(500).send("Something went wrong");
  }
};

module.exports = { handleWebhook };
