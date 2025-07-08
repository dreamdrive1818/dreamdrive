const axios = require("axios");
const { getZohoAccessToken } = require("./zohoAuth");

const fetchAttachmentsFromZoho = async (recordId) => {
  const accessToken = await getZohoAccessToken();
  if (!accessToken) return [];

  try {
    const url = `https://www.zohoapis.in/forms/v2/forms/${process.env.ZOHO_FORM_LINK_NAME}/formdata/${recordId}/attachments`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });

    const files = res.data?.data?.[0]?.attachments || [];
    return files; // [{ field_label, file_name, download_link }]
  } catch (err) {
    console.error("❌ Failed to fetch attachments:", err.response?.data || err.message);
    return [];
  }
};

module.exports = { fetchAttachmentsFromZoho };
