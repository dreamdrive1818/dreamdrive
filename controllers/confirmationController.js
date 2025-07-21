const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// setup OAuth
const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

exports.sendConfirmation = async (req, res) => {
  const { user, order } = req.body;

  if (!user || !order) {
    return res.status(400).json({ message: "User and order data are required." });
  }

  try {
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

   const htmlContent = `
  <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; padding: 24px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://res.cloudinary.com/du4rhbnw8/image/upload/v1693827829/dreamdrive_logo_transparent_s2zvug.png" alt="Dream Drive Logo" style="height: 60px;" />
    </div>

    <h2 style="color: #f4b400; text-align: center;">Booking Partially Confirmed</h2>
    <p style="text-align: center;">We have received your booking details. Your ride is reserved but pending <strong>payment and signing of the consent form.</strong></p>

    <h3 style="color: #333; text-align: center;">Ride ID: ${order.id}</h3>

    <hr style="margin: 24px 0;" />

    <h3>🚗 Car Details</h3>
    <p><strong>Name:</strong> ${order.car.name}</p>
    <p><strong>Type:</strong> ${order.car.type}</p>
    <p><strong>Seats:</strong> ${order.car.seats}</p>
    <p><strong>Fuel:</strong> ${order.car.fuel}</p>
    <p><strong>Transmission:</strong> ${order.car.transmission}</p>

    <h3>👤 User & Booking Info</h3>
    <p><strong>Name:</strong> ${user.fullName}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Phone:</strong> ${user.phone}</p>
    <p><strong>Booking Date:</strong> ${order.bookingDate}</p>
    <p><strong>Booking Time:</strong> ${order.bookingTime}</p>
    <p><strong>Rental Type:</strong> ${order.rentalType}</p>

    <h3>💳 Payment Summary and Booking Details</h3>
    <p><strong>Advance Paid:</strong> ₹${order.amount}</p>
    <p><strong>Status:</strong> <span style="color: orange;">Pending</span></p>
    <p><strong>Date of Request:</strong> ${order.timestamp}</p>

    <hr style="margin: 24px 0;" />

    <p style="text-align: center; font-size: 0.95rem;">
      A confirmation email has been sent. For any questions, feel free to chat with our support team via the live chat option.
    </p>

    <div style="text-align: center; margin-top: 20px;">
      <a href="${order.signFormUrl}" style="padding: 10px 20px; background-color: #007bff; color: #fff; border-radius: 6px; text-decoration: none; margin-right: 12px;">Sign Consent Form</a>
      <a href="${order.trackRideUrl}" style="padding: 10px 20px; background-color: #28a745; color: #fff; border-radius: 6px; text-decoration: none;">Track Your Ride</a>
    </div>

    <p style="margin-top: 30px; font-size: 0.85rem; color: #666;">
      Please note that your ride booking will be considered fully confirmed only upon receipt of the complete payment and submission of the signed consent form. Should you have any questions, feel free to contact our support team.
    </p>
  </div>
`;


    await transport.sendMail({
      from: `DreamDrive <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: `🚗 Ride Confirmation – Ride ID ${order.id}`,
      html: htmlContent,
    });

    res.status(200).json({ message: "Confirmation email sent." });
  } catch (error) {
    console.error("Confirmation email error:", error);
    res.status(500).json({ message: "Failed to send confirmation." });
  }
};
