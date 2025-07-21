const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { createClient } = require("redis");

let redisClient = null;

if (process.env.USE_REDIS !== false) {
  redisClient = createClient({
    url: process.env.REDIS_URI || "redis://localhost:6379"
  });

  redisClient.connect().catch((err) => {
    console.error("[Redis Connection Error]:", err.message);
  });
} else {
  console.log("[Redis]: Skipped (USE_REDIS=false or undefined)");
}

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
    <div style="max-width:600px;margin:auto;padding:20px;border-radius:10px;border:1px solid #eee;font-family:Arial,sans-serif;background:#fff;">
      <div style="text-align:center;">
        <img src="https://res.cloudinary.com/du4rhbnw8/image/upload/v1713786474/dreamdrive-logo_b1thgd.png" alt="DreamDrive Logo" style="height:70px;margin-bottom:20px;" />
        <h2 style="color:#111;margin:0;">Email Verification</h2>
        <p style="font-size:15px;color:#333;margin-top:8px;">
          Use the <span style="background-color:#fff3cd;padding:2px 6px;border-radius:4px;font-weight:bold;">OTP</span> below to verify your email address.
        </p>
        <div style="margin:25px 0;">
          <div style="display:inline-block;padding:18px 30px;background:#f4f6fb;border-radius:10px;font-size:30px;font-weight:bold;color:#2d63c8;letter-spacing:4px;">
            ${otp}
          </div>
        </div>
        <p style="color:#555;font-size:14px;">
          This <span style="background-color:#fff3cd;padding:2px 6px;border-radius:4px;font-weight:bold;">OTP</span> is valid for <strong>5 minutes</strong>.
          Please do not share it with anyone.
        </p>
        <p style="margin-top:30px;font-size:12px;color:#999;">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    </div>
  `,
});

    if (redisClient) {
      await redisClient.setEx(email, 300, otp);
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!redisClient) {
      return res.status(503).json({ message: "OTP verification not available in this mode" });
    }

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
