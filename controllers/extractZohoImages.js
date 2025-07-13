const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const ZOHO_USERNAME = process.env.ZOHO_USERNAME;
const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD;
const ZOHO_URL =
  "https://forms.zoho.in/dreamdrive1818gm1/report/CONSENTFORMFORCARHIRE_Report/records/web";

exports.extractZohoImages = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const safeEmailFolder = email.replace(/[^a-zA-Z0-9]/g, "_");
  const downloadDir = path.join(os.tmpdir(), `zoho_images_${safeEmailFolder}`);
  fs.ensureDirSync(downloadDir);
  console.log("📂 Download Dir:", downloadDir);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log("🚀 Browser launched");

    const page = await browser.newPage();
    console.log("🆕 New page created");

    const client = await page.target().createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: downloadDir,
    });
    console.log("💾 Download behavior set");

    // 1️⃣ Login
    await page.goto("https://accounts.zoho.in/signin?servicename=ZohoForms", {
      waitUntil: "networkidle2",
    });
    console.log("🌐 Navigated to Zoho login page");

    await page.type("#login_id", ZOHO_USERNAME);
    console.log("🔐 Username entered");
    await page.keyboard.press("Enter");

    await page.waitForSelector("#password", { visible: true });
    await page.type("#password", ZOHO_PASSWORD);
    console.log("🔐 Password entered");
    await new Promise(r => setTimeout(r, 400));
    await page.keyboard.press("Enter");
    console.log("🔓 Logged in");

    await new Promise(r => setTimeout(r, 1500));

    // 2️⃣ Go to Report
    await page.goto(ZOHO_URL, { waitUntil: "networkidle2" });
    console.log("📊 Navigated to Zoho Report URL");

    // 3️⃣ Apply Email Filter
    await page.waitForSelector("#filterIcon", { visible: true, timeout: 10000 });
    await page.click("#filterIcon");
    console.log("🔍 Filter icon clicked");

    await new Promise(r => setTimeout(r, 400));

    await page.click('[elname="Email"]');
    console.log("📨 Email filter selected");

    await page.waitForSelector('[id^="select2-Email-select-"]');
    await page.click('[id^="select2-Email-select-"]');
    console.log("📥 Filter condition dropdown clicked");

    await page.select('select[elname="Email"]', "EQUALS");
    console.log("✅ 'EQUALS' condition selected");

    await page.waitForSelector("#Email_val", { visible: true });
    await page.type("#Email_val", email);
    console.log(`📧 Entered email value: ${email}`);

    await page.click("#searchBtn");
    console.log("🔎 Search button clicked");

    // 4️⃣ Open Record
    await page.waitForSelector('[rec_owner="dreamdrive1818@gmail.com"]', { visible: true });
    await page.click('[rec_owner="dreamdrive1818@gmail.com"]');
    await new Promise(r => setTimeout(r, 400));
    console.log("📄 Record clicked");

    // 5️⃣ Wait for Summary and Download Links
    await page.waitForFunction(() => {
      const el = document.querySelector("#recordSumContainerId");
      return el && el.offsetParent !== null;
    }, { timeout: 10000 });
    console.log("📋 Record summary loaded");

    const downloadLinks = await page.$$eval('a[elname="download"]', (links) =>
      links
        .filter((a) => a.href.startsWith("https://download.zoho.in/webdownload"))
        .map((a) => a.href)
    );

    if (!downloadLinks.length) {
      console.log("❌ No download links found");
      return res.status(404).json({ message: "❌ No download links found" });
    }

    console.log(`📥 Found ${downloadLinks.length} download link(s)`);

    for (const href of downloadLinks) {
      await page.evaluate((h) => {
        const el = [...document.querySelectorAll('a[elname="download"]')].find(a => a.href === h);
        if (el) el.click();
      }, href);
      console.log(`✅ Download clicked: ${href}`);
      await new Promise((r) => setTimeout(r, 1000));
    }

    console.log("✅ All downloads triggered successfully");

    res.status(200).json({
      message: "✅ Images download triggered successfully",
      files: downloadLinks.length,
      savedTo: downloadDir,
    });

  } catch (error) {
    console.error("❌ Error during extraction:", error);
    res.status(500).json({ message: "Failed to extract images", error: error.message });
  } finally {
    if (browser) {
      await browser.close();
      console.log("🛑 Browser closed");
    }
  }
};
