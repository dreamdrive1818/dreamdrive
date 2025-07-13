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
  headless: 'new', // for latest Puppeteer
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

    const page = await browser.newPage();

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
await new Promise(r => setTimeout(r, 400));
await page.keyboard.press("Enter");

await new Promise(r => setTimeout(r, 1500));

    await page.goto(ZOHO_URL, { waitUntil: "networkidle2" });

    // 3️⃣ Apply Email Filter
    await page.click("#filterIcon");

    await new Promise((r) => setTimeout(r, 400));

    await page.click('[elname="Email"]');
    await page.waitForSelector('[id^="select2-Email-select-"]');
    await page.click('[id^="select2-Email-select-"]');
    await page.select('select[elname="Email"]', "EQUALS");
    await page.waitForSelector("#Email_val", { visible: true });
    await page.type("#Email_val", email);
    await page.click("#searchBtn");

    // 4️⃣ Open Record
    await page.waitForSelector('[rec_owner="dreamdrive1818@gmail.com"]', { visible: true });
    await page.click('[rec_owner="dreamdrive1818@gmail.com"]');
 await new Promise((r) => setTimeout(r, 400));


    // 5️⃣ Wait for Summary and Get Download Links
    await page.waitForFunction(() => {
      const el = document.querySelector("#recordSumContainerId");
      return el && el.offsetParent !== null;
    }, { timeout: 10000 });

    const downloadLinks = await page.$$eval('a[elname="download"]', (links) =>
      links
        .filter((a) => a.href.startsWith("https://download.zoho.in/webdownload"))
        .map((a) => a.href)
    );

    if (!downloadLinks.length) {
      return res.status(404).json({ message: "❌ No download links found" });
    }

    for (const href of downloadLinks) {
      await page.evaluate((h) => {
        const el = [...document.querySelectorAll('a[elname="download"]')].find(a => a.href === h);
        if (el) el.click();
      }, href);
      console.log(`✅ Download clicked: ${href}`);
      await new Promise((r) => setTimeout(r, 1000));
    }

    res.status(200).json({
      message: "✅ Images download triggered successfully",
      files: downloadLinks.length,
      savedTo: downloadDir,
    });

  } catch (error) {
    console.error("❌ Error during extraction:", error);
    res.status(500).json({ message: "Failed to extract images", error: error.message });
  } finally {
    if (browser) await browser.close();
  }
};
