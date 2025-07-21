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
    console.log("📩 Webhook received from:", data.email);

    const email = data.email;
    if (!email) {
      return res.status(400).send("❌ Email is required");
    }

    const formRef = db.collection("form_entries").doc(email);
    const docSnap = await formRef.get();

    const personal_info = {
      fname: data.fname || "",
      lname: data.lname || "",
      email: data.email || "",
      phone: data.phone || "",
      wphone: data.wphone || "",
      fathers_number: data.fathers_number || "",
      mothers_number: data.mothers_number || "",
      aadhar_number: data.aadhar_number || "",
      dl_number: data.dl_number || "",
      added_email_id: data.added_email_id || "",
    };

    const address = {
      street_address_1: data.street_address_1 || "",
      street_address_2: data.street_address_2 || "",
      address_city: data.address_city || "",
      address_state: data.address_state || "",
      address_zip: data.address_zip || "",
      address_country: data.address_country || "",
    };

    const newBooking = {
      pickup_location: data.pickup_location || "",
      destination_routes: data.destination_routes || "",
      selected_car: data.selected_car || "",
      start_date: data.start_date || "",
      start_time: data.start_time || "",
      end_date: data.end_date || "",
      end_time: data.end_time || "",
      token_amount_paid: data.token_amount_paid || "",
      security_money_paid: data.security_money_paid || "",
      where_did_you_here: data.where_did_you_here || "",
      referrer_name: data.referrer_name || "",
      terms_selected: data.terms_selected || "",
      id_address: data.id_address || "",
      added_time: data.added_time || "",
      timestamp: new Date().toISOString(),
    };

  if (!docSnap.exists) {
  // Create new document with structured data
  await formRef.set({
    personal_info,
    address,
    bookings: [newBooking],
  });
  console.log("🆕 Created new document for:", email);
} else {
  const existingData = docSnap.data();
  const updates = {};

  // Update personal_info fields if changed
  updates.personal_info = { ...(existingData.personal_info || {}) };
  for (const key in personal_info) {
    if (personal_info[key] && personal_info[key] !== updates.personal_info[key]) {
      updates.personal_info[key] = personal_info[key];
    }
  }

  // Update address fields if changed
  updates.address = { ...(existingData.address || {}) };
  for (const key in address) {
    if (address[key] && address[key] !== updates.address[key]) {
      updates.address[key] = address[key];
    }
  }

  // Deduplication check for bookings
  const existingBookings = existingData.bookings || [];
  const isDuplicate = existingBookings.some(
    (b) =>
      b.start_date === newBooking.start_date &&
      b.end_date === newBooking.end_date &&
      b.start_time === newBooking.start_time &&
      b.end_time === newBooking.end_time &&
      b.selected_car === newBooking.selected_car &&
      b.pickup_location === newBooking.pickup_location &&
      b.destination_routes === newBooking.destination_routes &&
      b.token_amount_paid === newBooking.token_amount_paid &&
      b.security_money_paid === newBooking.security_money_paid &&
      b.referrer_name === newBooking.referrer_name &&
      b.terms_selected === newBooking.terms_selected
  );

  if (!isDuplicate) {
    updates.bookings = [...existingBookings, newBooking];
    console.log("✅ Booking appended for:", email);
  } else {
    console.log("⏭️ Skipped duplicate booking for:", email);
  }

  await formRef.update(updates);
}


    res.status(200).send("✅ Booking data saved");
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.status(500).send("Something went wrong");
  }
};

module.exports = { handleWebhook };
