require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { createClient } = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

// Redis client setup
const redisClient = createClient({
  url: process.env.REDIS_URI,
});

redisClient.connect().catch(console.error);

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

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
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #ffffff; border: 1px solid #e2e8f0; padding: 30px; border-radius: 10px;">
      <div style="text-align: center;">
        <img src="https://res.cloudinary.com/dcf3mojai/image/upload/v1745574199/dream_drive-removebg-preview_x7duqr.png" alt="DreamDrive Logo" style="max-width: 150px; margin-bottom: 20px;" />
        <h2 style="color: #1e293b; font-size: 24px;">Email Verification</h2>
        <p style="color: #475569; font-size: 16px;">Use the OTP below to verify your email address.</p>
        <div style="margin: 30px 0;">
          <span style="display: inline-block; padding: 16px 30px; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #2563eb; background-color: #f3f4f6; border-radius: 8px;">
            ${otp}
          </span>
        </div>
        <p style="color: #64748b; font-size: 14px;">This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 40px;">If you didn't request this email, you can safely ignore it.</p>
      </div>
    </div>
  `
});

   
      await redisClient.setEx(email, 300, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});



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

app.post('/send-confirmation', async (req, res) => {
  const { user, order } = req.body;

  if (!user || !order) {
    return res.status(400).json({ message: "User and order data are required." });
  }

  try {
    await sendProductConfirmationMail(user, order);
    res.status(200).json({ message: "Confirmation email sent successfully." });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ message: "Failed to send confirmation email." });
  }
});


const sendProductConfirmationMail = async (user, order) => {
  if (!user || !order) {
    throw new Error("User and order data are required to send confirmation email.");
  }

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

  const { car, id: id, advancePaid, paymentStatus, createdAt } = order;
  const formattedDate = new Date(createdAt).toLocaleString("en-IN");

  const htmlContent = `
  <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
    
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://res.cloudinary.com/dcf3mojai/image/upload/v1745574199/dream_drive-removebg-preview_x7duqr.png" alt="Dream Drive Logo" style="max-width: 180px; margin-bottom: 10px;" />
    </div>

    <div style="text-align: center;">
      <div style="font-size: 56px; color: #22c55e;">✔</div>
      <h2 style="color: #1e293b; font-size: 24px;">Booking Confirmed!</h2>
      <p style="color: #475569; font-size: 16px;">Your ride has been successfully scheduled.</p>
      <p style="font-weight: bold; color: #1e293b; font-size: 16px;">Ride ID: ${id}</p>
    </div>

    <table style="width: 100%; margin-top: 35px; font-size: 15px;">
      <tr>
        <td style="vertical-align: top; padding: 12px;">
          <h4 style="color: #0f172a; margin-bottom: 8px;">🚗 Car Details</h4>
          <p><strong>Name:</strong> ${car.name}</p>
          <p><strong>Type:</strong> ${car.details.type}</p>
          <p><strong>Seats:</strong> ${car.details.seats}</p>
          <p><strong>Fuel:</strong> ${car.details.fuel}</p>
          <p><strong>Transmission:</strong> ${car.details.mt === "YES" ? "Manual" : "Automatic"}</p>
        </td>
        <td style="vertical-align: top; padding: 12px;">
          <h4 style="color: #0f172a; margin-bottom: 8px;">👤 User Info</h4>
          <p><strong>Name:</strong> ${user.fullName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user.phone}</p>
        </td>
        <td style="vertical-align: top; padding: 12px;">
          <h4 style="color: #0f172a; margin-bottom: 8px;">💳 Payment Summary</h4>
          <p><strong>Advance Paid:</strong> ₹${advancePaid}</p>
          <p><strong>Status:</strong> ${paymentStatus}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
        </td>
      </tr>
    </table>

    <p style="margin-top: 30px; color: #475569; font-size: 14px; text-align: center;">
      A confirmation email has been sent. For any questions, feel free to chat with our support team via the live chat option.
    </p>

    <div style="text-align: center; margin-top: 35px;">
      <a href="https://forms.zohopublic.in/dreamdrive1818gm1/form/CONSENTFORMFORCARHIRE/formperma/XcyUB9S6UcHoPngvocFg76vVhZcn4lJco34EPSjBy_o" 
         style="background-color: #2563eb; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px;">
        Sign Consent Form to Proceed
      </a>
    </div>

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


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
