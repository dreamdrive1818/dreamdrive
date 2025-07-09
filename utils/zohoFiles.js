const axios = require("axios");
const { getZohoAccessToken } = require("./zohoAuth");

const FORM_LINK_NAME = "CONSENTFORMFORCARHIRE";
const ZOHO_API_DOMAIN = "https://www.zohoapis.in";

const fetchAttachmentsFromZoho = async (recordId) => {
  try {
    const ZOHO_ACCESS_TOKEN = await getZohoAccessToken();

    const res = await axios.get(
      `${ZOHO_API_DOMAIN}/api/v2/forms/${FORM_LINK_NAME}/records/${recordId}/attachments`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${ZOHO_ACCESS_TOKEN}`,
        },
      }
    );

    const files = res.data.data || [];
    return files.map((f) => ({
      field_label: f.field_label.replace(/\s+/g, "_").toLowerCase(),
      file_name: f.file_name,
      download_link: `${ZOHO_API_DOMAIN}/api/v2/forms/${FORM_LINK_NAME}/attachment/${recordId}/${f.file_name}`,
    }));
  } catch (err) {
    console.error("❌ Failed to fetch attachments from Zoho:", err.message);
    return [];
  }
};

module.exports = { fetchAttachmentsFromZoho };
