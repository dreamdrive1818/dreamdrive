const axios = require("axios");

const getZohoAccessToken = async () => {
  try {
    const response = await axios.post("https://accounts.zoho.in/oauth/v2/token", null, {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("🔁 Failed to refresh Zoho token:", error.response?.data || error.message);
    return null;
  }
};

module.exports = { getZohoAccessToken };
