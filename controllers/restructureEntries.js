const admin = require("firebase-admin");
const db = admin.firestore();

async function restructureFormEntries() {
  const snapshot = await db.collection("form_entries").get();
  if (snapshot.empty) {
    console.log("❌ No entries found.");
    return;
  }

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const email = doc.id;

    // Skip if already restructured
    if (data.personal_info && data.bookings) {
      console.log(`⏭️ Skipped: Already restructured → ${email}`);
      continue;
    }

    const personal_info = {
      fname: data.fname || "",
      lname: data.lname || "",
      email: data.email || "",
      phone: data.phone || "",
      wphone: data.wphone || "",
      fathers_number: data.fathers_name || "",
      mothers_number: data.mothers_name || "",
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

    const booking = {
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
      timestamp: data.timestamp || new Date().toISOString(),
    };

    await db.collection("form_entries").doc(email).set({
      personal_info,
      address,
      bookings: [booking],
    });

    console.log(`✅ Updated: ${email}`);
  }

  console.log("🎉 All entries restructured.");
}

restructureFormEntries().catch(console.error);

async function updateParentFieldNames() {
  const snapshot = await db.collection("form_entries").get();

  for (const doc of snapshot.docs) {
    const data = doc.data();

    if (!data.personal_info) {
      console.log(`⏭️ Skipped ${doc.id}: No personal_info object`);
      continue;
    }

    const updatedFields = {
      ...(data.personal_info.fathers_name && { "personal_info.fathers_number": data.personal_info.fathers_name }),
      ...(data.personal_info.mothers_name && { "personal_info.mothers_number": data.personal_info.mothers_name }),
      "personal_info.fathers_name": admin.firestore.FieldValue.delete(),
      "personal_info.mothers_name": admin.firestore.FieldValue.delete(),
    };

    await db.collection("form_entries").doc(doc.id).update(updatedFields);
    console.log(`✅ Updated: ${doc.id}`);
  }

  console.log("🎉 Done updating field names.");
}

updateParentFieldNames().catch(console.error);


module.exports = { restructureFormEntries,updateParentFieldNames };
