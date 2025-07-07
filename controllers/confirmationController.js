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
      <div>
        <h2>Booking Confirmation</h2>
        <p>Ride ID: ${order.id}</p>
        <p>Car: ${order.car.name}</p>
        <p>User: ${user.fullName}</p>
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
