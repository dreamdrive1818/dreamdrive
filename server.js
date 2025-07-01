require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { createClient } = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

// Redis
const redisClient = createClient({
  url: process.env.REDIS_URI,
});
redisClient.connect().catch(console.error);

// OAuth
const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

// Send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    await transport.sendMail({
      from: `DreamDrive <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "🔐 Verify Your Email - DreamDrive OTP",
      html: `
        <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;background:#fff;border:1px solid #e2e8f0;padding:30px;border-radius:10px;">
          <div style="text-align:center;">
            <img src="https://res.cloudinary.com/dcf3mojai/image/upload/v1745574199/dream_drive-removebg-preview_x7duqr.png" alt="DreamDrive" style="max-width:150px;margin-bottom:20px;" />
            <h2 style="color:#1e293b;font-size:24px;">Email Verification</h2>
            <p style="color:#475569;font-size:16px;">Use the OTP below to verify your email address.</p>
            <div style="margin:30px 0;">
              <span style="display:inline-block;padding:16px 30px;font-size:28px;font-weight:bold;letter-spacing:4px;color:#2563eb;background:#f3f4f6;border-radius:8px;">
                ${otp}
              </span>
            </div>
            <p style="color:#64748b;font-size:14px;">Valid for <strong>5 minutes</strong>. Please do not share it.</p>
          </div>
        </div>
      `,
    });

    await redisClient.setEx(email, 300, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const savedOtp = await redisClient.get(email);

    if (savedOtp && savedOtp === otp) {
      await redisClient.del(email);
      return res.json({ verified: true });
    } else {
      return res.status(400).json({ verified: false, message: "Incorrect OTP" });
    }
  } catch (err) {
    console.error("OTP verify error:", err);
    return res.status(500).json({ message: "Server error during OTP verification" });
  }
});

// Confirmation
app.post('/send-confirmation', async (req, res) => {
  const { user, order } = req.body;

  if (!user || !order) {
    return res.status(400).json({ message: "User and order data are required." });
  }

  try {
    await sendProductConfirmationMail(user, order);
    res.status(200).json({ message: "Confirmation email sent." });
  } catch (error) {
    console.error("Confirmation email error:", error);
    res.status(500).json({ message: "Failed to send confirmation." });
  }
});

const sendProductConfirmationMail = async (user, order) => {
  const accessToken = await oAuth2Client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  const {
    car,
    id,
    advancePaid,
    paymentStatus,
    createdAt,
    bookingDate,
    bookingTime,
    rentalType,
    bookingCategory,
    tripType,
    pickupLocation,
    startingCity,
    endingCity
  } = order;

  const formattedDate = new Date(createdAt).toLocaleString("en-IN");

  const categoryBlock = bookingCategory
    ? `<p><strong>Category:</strong> ${bookingCategory.charAt(0).toUpperCase() + bookingCategory.slice(1)}</p>`
    : "";

  const tripTypeBlock =
    bookingCategory === "intercity" && tripType
      ? `<p><strong>Trip Type:</strong> ${tripType.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}</p>`
      : "";

  const pickupBlock =
    rentalType === "self-drive" && pickupLocation
      ? `<p><strong>Pickup Location:</strong> ${pickupLocation}</p>`
      : "";

  const startingCityBlock =
    (bookingCategory === "local" || bookingCategory === "intercity") && startingCity
      ? `<p><strong>Starting City:</strong> ${startingCity}</p>`
      : "";

  const endingCityBlock =
    bookingCategory === "intercity" && endingCity
      ? `<p><strong>Ending City:</strong> ${endingCity}</p>`
      : "";

  const htmlContent = `
    <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;padding:30px 20px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;">
      <div style="text-align:center;">
        <img src="https://res.cloudinary.com/dcf3mojai/image/upload/v1745574199/dream_drive-removebg-preview_x7duqr.png" alt="Dream Drive" style="max-width:160px;height:auto;margin-bottom:10px;" />
      </div>
      <div style="text-align:center;">
        <div style="font-size:24px;color:#22c55e;">✔</div>
        <h2 style="color:#eab308;font-size:22px;margin:10px 0;">Booking Partially Confirmed</h2>
        <p style="color:#475569;font-size:16px;">We have received your booking. Your ride is reserved but pending <strong>payment</strong> and <strong>consent form</strong>.</p>
        <p style="font-weight:bold;color:#1e293b;">Ride ID: ${id}</p>
      </div>
      <table style="width:100%;margin-top:30px;font-size:14px;">
        <tr>
          <td style="padding:12px;">
            <h4 style="color:#0f172a;margin-bottom:8px;font-size:16px;">🚗 Car Details</h4>
            <p><strong>Name:</strong> ${car.name}</p>
            <p><strong>Type:</strong> ${car.details.type}</p>
            <p><strong>Seats:</strong> ${car.details.seats}</p>
            <p><strong>Fuel:</strong> ${car.details.fuel}</p>
            <p><strong>Transmission:</strong> ${car.details.mt === "YES" ? "Manual" : "Automatic"}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:12px;">
            <h4 style="color:#0f172a;margin-bottom:8px;font-size:16px;">👤 User & Booking Info</h4>
            <p><strong>Name:</strong> ${user.fullName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Rental Type:</strong> ${rentalType === "self-drive" ? "Self-Drive" : "With Driver"}</p>
            ${categoryBlock}
            ${tripTypeBlock}
            ${startingCityBlock}
            ${endingCityBlock}
            ${pickupBlock}
            <p><strong>Booking Date:</strong> ${bookingDate || "-"}</p>
            <p><strong>Booking Time:</strong> ${bookingTime || "-"}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:12px;">
            <h4 style="color:#0f172a;margin-bottom:8px;font-size:16px;">💳 Payment</h4>
            <p><strong>Advance Paid:</strong> ₹${advancePaid}</p>
            <p><strong>Status:</strong> ${paymentStatus}</p>
            <p><strong>Date of Request:</strong> ${formattedDate}</p>
          </td>
        </tr>
      </table>
      <p style="margin-top:30px;color:#475569;text-align:center;">
        A confirmation email has been sent. Please complete your consent form and payment.
      </p>
      <div style="text-align:center;margin-top:35px;">
        <a href="https://forms.zohopublic.in/dreamdrive1818gm1/form/CONSENTFORMFORCARHIRE/formperma/XcyUB9S6UcHoPngvocFg76vVhZcn4lJco34EPSjBy_o"
          style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;margin-right:12px;">
          Sign Consent Form
        </a>
        <a href="https://dream-drive.co.in/order-tracking"
          style="background:#16a34a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">
          Track Your Ride
        </a>
      </div>
      <p style="margin-top:30px;color:#475569;text-align:center;">
        Your ride will be fully confirmed after payment & consent form submission.
      </p>
    </div>
  `;

  const mailOptions = {
    from: `DreamDrive <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: `🚗 Ride Confirmation – Ride ID ${id}`,
    html: htmlContent,
  };

  await transport.sendMail(mailOptions);
};

// start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
