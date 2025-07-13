const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const ZOHO_USERNAME = process.env.ZOHO_USERNAME;
const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD;
// const ZOHO_URL =
//   "https://forms.zoho.in/dreamdrive1818gm1/report/CONSENTFORMFORCARHIRE_Report/records/web";

const ZOHO_URL =
  "https://forms.zoho.in/tufmachine1/report/DEMOFORM_Report/records/web";


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
  headless: 'new', // Or true
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-blink-features=AutomationControlled',
    '--window-size=1280,800'
  ],
  defaultViewport: {
    width: 1280,
    height: 800
  }
});

const page = await browser.newPage();

// Spoof browser fingerprint
await page.setUserAgent(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
);

await page.setJavaScriptEnabled(true);

// Remove puppeteer detection
await page.evaluateOnNewDocument(() => {
  Object.defineProperty(navigator, 'webdriver', {
    get: () => false,
  });
});

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
     await new Promise(r => setTimeout(r, 400));
    console.log("🔐 Username entered",ZOHO_USERNAME);
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


//3 ️⃣ Click on search button
await page.waitForSelector('body', { visible: true });
    await new Promise(r => setTimeout(r, 2000));

const searchIconTriggered = await page.evaluate(() => {
  const el = document.querySelector('#searchIcon');
  const zfAvailable = typeof window.ZFReportLive !== 'undefined';

  if (!el) {
    console.log("❌ searchIcon not found");
    return 'no-icon';
  }

  if (!zfAvailable) {
    console.log("❌ ZFReportLive not available");
    return 'no-zf';
  }

  try {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    ZFReportLive.showSearch(el);
    return 'clicked';
  } catch (e) {
    console.error("⚠️ Error triggering click", e);
    return 'error';
  }
});

if (searchIconTriggered === 'clicked') {
  console.log("✅ Successfully triggered ZFReportLive.showSearch");
} else if (searchIconTriggered === 'no-icon') {
  throw new Error("❌ #searchIcon not found in DOM");
} else if (searchIconTriggered === 'no-zf') {
  throw new Error("❌ ZFReportLive is not loaded yet on the page");
} else {
  throw new Error("❌ Unknown error while triggering ZFReportLive");
}


// 4 Search for Report
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
        await new Promise(r => setTimeout(r, 1000));

        // Wait for the element to appear
await page.waitForSelector('.rPorts-SearchList-Close', { visible: true });

// Click it
await page.click('.rPorts-SearchList-Close');
console.log("❌ Closed search list");
  await new Promise(r => setTimeout(r, 1000));

    // 4️⃣ Open Record
   await page.waitForSelector('[rec_owner="huntersgaming825@gmail.com"]', { visible: true });
const recordButton = await page.$('[rec_owner="huntersgaming825@gmail.com"]');
if (!recordButton) throw new Error("❌ Record button not found after filtering");
await recordButton.click();
await new Promise(r => setTimeout(r, 200));
await recordButton.click();


const debugScreenshotPath = path.join(os.tmpdir(), "after_record_click.png");
fs.ensureDirSync(path.dirname(debugScreenshotPath)); // make sure dir exists
await page.screenshot({ path: debugScreenshotPath, fullPage: true });
console.log("🖼 Screenshot saved to:", debugScreenshotPath);
console.log("🖼 Screenshot taken after record click");


    // 5️⃣ Wait for Summary and Download Links
    await page.waitForFunction(() => {
  const el = document.querySelector("#recordSumContainerId");
  return el && el.offsetParent !== null;
}, { timeout: 20000 }); // wait up to 20s
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
