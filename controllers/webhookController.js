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

    const email = data.email;
    if (!email) {
      return res.status(400).send("❌ Email is required in the payload");
    }

    const formRef = db.collection("form_entries").doc(email);
    const docSnap = await formRef.get();

    const bookingData = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    if (!docSnap.exists) {
      // If form entry doesn't exist, create it with initial structure
      await formRef.set({
        email,
        fname: data.fname,
        lname: data.lname,
        created_at: new Date().toISOString(),
      });
      console.log("📄 Created new form_entries document for:", email);
    }

    // Save booking inside 'bookings' subcollection
    await formRef.collection("bookings").add(bookingData);
    console.log("📝 Booking saved for:", email);

    res.status(200).send("✅ Booking data saved");
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.status(500).send("Something went wrong");
  }
};

module.exports = { handleWebhook };
