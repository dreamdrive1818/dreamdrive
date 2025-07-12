const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const fs = require("fs-extra");
const path = require("path");
  const os = require("os");

const ZOHO_USERNAME = process.env.ZOHO_USERNAME;
const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD;
const ZOHO_URL = "https://forms.zoho.in/dreamdrive1818gm1/report/CONSENTFORMFORCARHIRE_Report/records/web";

exports.extractZohoImages = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required in request body" });
  }

  const EMAIL_TO_SELECT = email;


const safeEmailFolder = email.replace(/[^a-zA-Z0-9]/g, "_");
// const downloadsPath = path.join(os.homedir(), "Downloads/Zoho_images");
const downloadDir = path.join(os.tmpdir(), `zoho_images_${safeEmailFolder}`);

fs.ensureDirSync(downloadDir);

  fs.ensureDirSync(downloadDir);
  console.log("Download Dir:", downloadDir);

 const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath,
  headless: chromium.headless,
  defaultViewport: { width: 1280, height: 800 },
});


  const page = await browser.newPage();

  // Minimize browser window (optional)
  try {
    const session = await page.target().createCDPSession();
    const { windowId } = await session.send('Browser.getWindowForTarget');
    await session.send('Browser.setWindowBounds', {
      windowId,
      bounds: { windowState: 'minimized' }
    });
  } catch (err) {
    console.warn("⚠️ Failed to minimize window:", err.message);
  }

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadDir,
  });



  try {
    // 1️⃣ Login to Zoho
    await page.goto("https://accounts.zoho.in/signin?servicename=ZohoForms", {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector("#login_id");
    await page.type("#login_id", ZOHO_USERNAME);
    await page.keyboard.press("Enter");

    await page.waitForSelector("#password", { visible: true });
    await page.type("#password", ZOHO_PASSWORD);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await page.keyboard.press("Enter");

    // 2️⃣ Go to Zoho Forms report page
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await page.goto(ZOHO_URL, { waitUntil: "networkidle2" });

    // 3️⃣ Apply filter by email
    await page.waitForSelector("#filterIcon");
    await page.click("#filterIcon");

    await new Promise((resolve) => setTimeout(resolve, 200));
    await page.waitForSelector('[elname="Email"]');
    await page.click('[elname="Email"]');

    await page.waitForSelector('[id^="select2-Email-select-"]');
    await page.click('[id^="select2-Email-select-"]');
    await new Promise((resolve) => setTimeout(resolve, 400));
    await page.select('select[elname="Email"]', "EQUALS");

    await page.waitForSelector("#Email_val", { visible: true });
    await page.type("#Email_val", EMAIL_TO_SELECT);

    await new Promise((resolve) => setTimeout(resolve, 200));
    await page.waitForSelector("#searchBtn", { visible: true });
    await page.click("#searchBtn");

    // 4️⃣ Click record with matching rec_owner
    await new Promise((resolve) => setTimeout(resolve, 500));
    await page.waitForSelector('[rec_owner="dreamdrive1818@gmail.com"]');
    await page.click('[rec_owner="dreamdrive1818@gmail.com"]');

      await new Promise((resolve) => setTimeout(resolve, 500));
    // 5️⃣ Wait and identify iframe
const record = await page.waitForSelector(`[rec_owner]`, { visible: true });
await record.click();

// Wait for the summary container (not immediately after click)
await page.waitForFunction(() => {
  const el = document.querySelector('#recordSumContainerId');
  return el && el.offsetParent !== null;
}, { timeout: 10000 });

// Click all download links that start with Zoho's download domain
const downloadLinks = await page.$$eval('a[elname="download"]', (links) =>
  links
    .filter(link => link.href.startsWith("https://download.zoho.in/webdownload"))
    .map(link => link.href)
);

// Report if no downloads
if (downloadLinks.length === 0) {
  return res.status(404).json({ message: "❌ No downloadable links found in record summary" });
}

// Loop and click each download link
for (let i = 0; i < downloadLinks.length; i++) {
  await page.evaluate((href) => {
    const link = Array.from(document.querySelectorAll('a[elname="download"]')).find(a => a.href === href);
    if (link) link.click();
  }, downloadLinks[i]);

  console.log(`✅ Clicked download link ${i + 1}`);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1s delay for each download
}


    res.status(200).json({
      message: "✅ All download links clicked successfully",
      total: downloadLinks.length,
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      message: "Error during Zoho image extraction",
      error: error.message,
    });
  } finally {
    await browser.close();
  }
};
