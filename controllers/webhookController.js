const db = require("../config/firebase");
const axios = require("axios");

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`;
const UPLOAD_PRESET = process.env.CLOUDINARY_PRESET;

// Define file-type fields from Zoho
const FILE_FIELDS = [
  "aadhar_front_image",
  "aadhar_back_image",
  "dl_image",
  "pan_image",
  "driver_selfie"
];

// 🔼 Upload to Cloudinary
const uploadToCloudinary = async (filename, folderName) => {
  try {
    const fileUrl = `https://forms.zoho.in/api/form/YOUR_FORM_NAME/attachment/${filename}`;

    const response = await axios.post(CLOUDINARY_URL, {
      file: fileUrl,
      upload_preset: UPLOAD_PRESET,
      folder: folderName,
    });

    return response.data.secure_url;
  } catch (err) {
    console.error(`❌ Upload failed for ${filename}:`, err.message);
    return null;
  }
};

// 🚀 Main Webhook Logic
const handleWebhook = async (req, res) => {
  try {
    const data = req.body;
    console.log("📩 Webhook data received:", data);

    const docId = data.email || `entry_${Date.now()}`;
    const fname = (data.fname || "Unknown").trim();
    const lname = (data.lname || "User").trim();
    const folderName = `${fname}_${lname}`.replace(/\s+/g, "_");

    // 📂 Upload all file fields to folder
    const uploadedUrls = {};

    for (const field of FILE_FIELDS) {
      const files = data[field];
      if (Array.isArray(files) && files.length > 0) {
        const urls = await Promise.all(
          files.map(filename => uploadToCloudinary(filename, folderName))
        );
        uploadedUrls[`${field}_urls`] = urls.filter(Boolean);
      }
    }

    // 🔥 Save full entry to Firestore
    await db.collection("form_entries").doc(docId).set({
      ...data,
      ...uploadedUrls,
      timestamp: new Date().toISOString(),
    });

    res.status(200).send("✅ Entry saved");
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.status(500).send("❌ Something went wrong");
  }
};

module.exports = { handleWebhook };
