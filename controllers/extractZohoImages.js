const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const ZOHO_USERNAME = process.env.ZOHO_USERNAME;
const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD;
const ZOHO_URL =
  "https://forms.zoho.in/dreamdrive1818gm1/report/CONSENTFORMFORCARHIRE_Report/records/web";

const isRender = !!process.env.RENDER; // Set this env var to true on Render

exports.extractZohoImages = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const safeEmailFolder = email.replace(/[^a-zA-Z0-9]/g, "_");

  // ✅ Dynamic download directory based on env
  const downloadDir = isRender
    ? path.join(os.tmpdir(), `zoho_images_${safeEmailFolder}`)
    : path.join(__dirname, `../zoho_images/${safeEmailFolder}`);

  fs.ensureDirSync(downloadDir);
  console.log("📂 Download Dir:", downloadDir);

  let browser;
  try {
    browser = await puppeteer.launch(
      isRender
        ? {
            args: chromium.args,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            defaultViewport: { width: 1280, height: 800 },
          }
        : {
            headless: false,
            defaultViewport: { width: 1280, height: 800 },
          }
    );

    const page = await browser.newPage();

    // Allow downloads
    const client = await page.target().createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: downloadDir,
    });

    // 1️⃣ Login
    await page.goto("https://accounts.zoho.in/signin?servicename=ZohoForms", {
      waitUntil: "networkidle2",
    });
    await page.type("#login_id", ZOHO_USERNAME);
    await page.keyboard.press("Enter");

    await page.waitForSelector("#password", { visible: true });
    await page.type("#password", ZOHO_PASSWORD);
    await page.waitForTimeout(400);
    await page.keyboard.press("Enter");

    // 2️⃣ Navigate to report
    await page.waitForTimeout(1500);
    await page.goto(ZOHO_URL, { waitUntil: "networkidle2" });

    // 3️⃣ Apply filter
    await page.click("#filterIcon");
    await page.waitForTimeout(200);
    await page.click('[elname="Email"]');
    await page.waitForSelector('[id^="select2-Email-select-"]');
    await page.click('[id^="select2-Email-select-"]');
    await page.select('select[elname="Email"]', "EQUALS");

    await page.waitForSelector("#Email_val", { visible: true });
    await page.type("#Email_val", email);
    await page.click("#searchBtn");

    // 4️⃣ Wait for records and click
    await page.waitForSelector('[rec_owner="dreamdrive1818@gmail.com"]', {
      visible: true,
    });
    await page.click('[rec_owner="dreamdrive1818@gmail.com"]');
    await page.waitForTimeout(600);

    // 5️⃣ Wait for summary and extract links
    await page.waitForFunction(() => {
      const el = document.querySelector("#recordSumContainerId");
      return el && el.offsetParent !== null;
    }, { timeout: 10000 });

    const downloadLinks = await page.$$eval('a[elname="download"]', (links) =>
      links
        .filter((a) =>
          a.href.startsWith("https://download.zoho.in/webdownload")
        )
        .map((a) => a.href)
    );

    if (!downloadLinks.length) {
      return res
        .status(404)
        .json({ message: "❌ No download links found in record." });
    }

    for (let i = 0; i < downloadLinks.length; i++) {
      await page.evaluate((href) => {
        const el = Array.from(
          document.querySelectorAll('a[elname="download"]')
        ).find((a) => a.href === href);
        if (el) el.click();
      }, downloadLinks[i]);
      console.log(`✅ Clicked download link ${i + 1}`);
      await page.waitForTimeout(1000);
    }

    return res.status(200).json({
      message: "✅ Images downloading...",
      files: downloadLinks.length,
      savedTo: downloadDir,
    });
  } catch (error) {
    console.error("❌ Error during extraction:", error);
    return res.status(500).json({
      message: "Failed to extract images",
      error: error.message,
    });
  } finally {
    if (browser) await browser.close();
  }
};
