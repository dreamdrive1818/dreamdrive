const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URI,
});
redisClient.connect().catch(console.error);

// setup OAuth
const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

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

    await transport.sendMail({
      from: `DreamDrive <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "🔐 Verify Your Email - DreamDrive OTP",
      html: `
        <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;">
          <h2>Verify your email</h2>
          <h3>OTP: ${otp}</h3>
          <p>Valid for 5 minutes</p>
        </div>
      `,
    });

    await redisClient.setEx(email, 300, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
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
};
