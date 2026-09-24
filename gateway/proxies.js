const { createProxyMiddleware } = require("http-proxy-middleware");

const SERVICE_URLS = {
  identity: process.env.IDENTITY_URL || "http://127.0.0.1:5001",
  catalog: process.env.CATALOG_URL || "http://127.0.0.1:5005",
  booking: process.env.BOOKING_URL || "http://127.0.0.1:5004",
  notify: process.env.NOTIFY_URL || "http://127.0.0.1:5002",
  crm: process.env.CRM_URL || "http://127.0.0.1:5003",
};

function to(target) {
  return createProxyMiddleware({ target, changeOrigin: true });
}

function mountGatewayProxies(app) {
  app.use("/api/identity", to(SERVICE_URLS.identity));
  app.use("/api/catalog", to(SERVICE_URLS.catalog));
  app.use("/api/booking", to(SERVICE_URLS.booking));
  app.use("/api/notify", to(SERVICE_URLS.notify));
  app.use("/api/send-otp", to(SERVICE_URLS.notify));
  app.use("/api/verify-otp", to(SERVICE_URLS.notify));
  app.use("/api/send-confirmation", to(SERVICE_URLS.notify));
  app.use("/api/crm", to(SERVICE_URLS.crm));
  app.use("/api/zoho-webhook", to(SERVICE_URLS.crm));
  app.use("/api/form-entries", to(SERVICE_URLS.crm));
}

module.exports = { mountGatewayProxies, SERVICE_URLS };
