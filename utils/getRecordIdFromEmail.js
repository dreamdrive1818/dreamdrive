const axios = require("axios");
const { getZohoAccessToken } = require("./zohoAuth");

const FORM_LINK_NAME = "CONSENTFORMFORCARHIRE";
const ZOHO_API_DOMAIN = "https://forms.zoho.in";

const getRecordIdFromEmail = async (email) => {
  try {
    const accessToken = await getZohoAccessToken();

     console.log("🔍 API URL:", `${ZOHO_API_DOMAIN}/api/v2/forms/${FORM_LINK_NAME}/records?filterBy=email==${email}`);
     console.log("🔐 Access Token:", accessToken);
    const response = await axios.get(
      `${ZOHO_API_DOMAIN}/api/v2/forms/${FORM_LINK_NAME}/records?filterBy=email==${email}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );

   

    const record = response.data?.data?.[0];
    return record?.record_id || null;
  } catch (err) {
    console.error("❌ Error fetching record ID:", err.response?.data || err.message);
    return null;
  }
};

module.exports = { getRecordIdFromEmail };
