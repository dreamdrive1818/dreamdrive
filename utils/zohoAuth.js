const axios = require("axios");

const getZohoAccessToken = async () => {
  try {
    const res = await axios.post("https://accounts.zoho.in/oauth/v2/token", null, {
      params: {
        code: "1000.6a0a5c53b51935ac7b1bec16609ead3b.8bde20f1001efdcb089e65532fe7152f", 
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        redirect_uri: process.env.ZOHO_REDIRECT_URI,
        grant_type: "authorization_code",
      },
    });

    console.log("Response",res);

      console.log("✅ Access Token:", res.data.access_token);
    console.log("🎉 Refresh Token (save this!):", res.data.refresh_token);

    return res.data;
  } catch (err) {
    console.error("❌ Failed to get Access token:", err.res?.data || err.message);
    return null;
  }
};

module.exports = { getZohoAccessToken };
