const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const ZOHO_USERNAME = process.env.ZOHO_USERNAME;
const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD;
const ZOHO_URL = "https://forms.zoho.in/tufmachine1/report/DEMOFORM_Report/records/web";

// 🌟 Main Handler
exports.extractZohoImages = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
  const downloadDir = path.join(os.tmpdir(), `zoho_images_${safeEmail}`);
  fs.ensureDirSync(downloadDir);
  console.log("📁 Download directory ensured:", downloadDir);

  let browser;
  try {
    browser = await launchBrowser(downloadDir);
    const page = await browser.newPage();

    await spoofBrowser(page);
    await loginToZoho(page);
    await navigateToReportPage(page);
    await clickEmailRow(page, email);

    const screenshotPath = path.join(os.tmpdir(), "after_record_click.png");
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log("🖼 Screenshot saved after clicking record:", screenshotPath);

    const downloadLinks = await extractDownloadLinks(page);
    if (!downloadLinks.length) {
      console.log("❌ No download links found");
      return res.status(404).json({ message: "❌ No download links found" });
    }

    console.log(`📥 Found ${downloadLinks.length} download link(s)`);
    await triggerDownloads(page, downloadLinks);

    res.status(200).json({
      message: "✅ Images download triggered successfully",
      files: downloadLinks.length,
      savedTo: downloadDir,
    });

  } catch (error) {
    console.error("❌ Error occurred during process:", error);
    res.status(500).json({ message: "Failed to extract images", error: error.message });
  } finally {
    if (browser) {
      await browser.close();
      console.log("🛑 Browser closed");
    }
  }
};

// 🧱 Launch browser and set download path
async function launchBrowser(downloadDir) {
  console.log("🚀 Launching Puppeteer browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1280,800'
    ],
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();
  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadDir,
  });
  console.log("💾 Download behavior set to:", downloadDir);

  return browser;
}

// 🔍 Spoof browser fingerprint to avoid detection
async function spoofBrowser(page) {
  console.log("🕵️ Spoofing browser fingerprint...");
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36");
  await page.setJavaScriptEnabled(true);
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  console.log("✅ Spoofing complete");
}

// 🔐 Log into Zoho account
async function loginToZoho(page) {
  console.log("🔐 Navigating to Zoho login page...");
  await page.goto("https://accounts.zoho.in/signin?servicename=ZohoForms", { waitUntil: "networkidle2" });

  const loginUrl = page.url();
  if (!loginUrl.includes("accounts.zoho.in")) throw new Error(`Unexpected login page: ${loginUrl}`);
  console.log("🔍 Login page verified:", loginUrl);

  await page.type("#login_id", ZOHO_USERNAME);
  console.log("👤 Username entered");
  await page.keyboard.press("Enter");

  await page.waitForSelector("#password", { visible: true });
  await page.type("#password", ZOHO_PASSWORD);
  console.log("🔑 Password entered");
    await new Promise(r => setTimeout(r, 400));

try {
  await page.waitForSelector("#nextbtn", { visible: true, timeout: 5000 });
  await page.click("#nextbtn");
  console.log("✅ Next button clicked");
    await new Promise(r => setTimeout(r, 2000));
} catch (err) {
  console.error("❌ Failed to click next button:", err.message);
}

    return;
  // Wait for redirect
  // let retries = 0;
  // while (retries++ < 10) {
  //   await new Promise(r => setTimeout(r, 1000));
  //   const newUrl = page.url();
  //   if (!newUrl.includes("accounts.zoho.in")) {
  //     console.log("✅ Login successful, redirected to:", newUrl);
  //     return;
  //   }
  //   console.log(`⏳ Waiting for login redirect... attempt ${retries}`);
  // }

  // throw new Error("❌ Login redirect timeout. Still on login page.");
}

// 🧭 Navigate to Zoho Report Page
async function navigateToReportPage(page) {
  console.log("📄 Navigating to Zoho report page...");
  await page.goto(ZOHO_URL, { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 400));

  let currentUrl = page.url();

    console.warn("⚠️ Wrapper page detected, retrying...");
    await page.goto("https://forms.zoho.in/", { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 400));
    currentUrl = page.url();
    console.log("retried",currentUrl);

 
    await new Promise(r => setTimeout(r, 2000));

     console.log("redirecting to ZOHO URL");
      await page.goto(ZOHO_URL, { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 1000));

     currentUrl = page.url();
    console.log("retried 2",currentUrl);


  // currentTitle = await page.title();
  // if (!currentUrl.includes("/report/") || !currentUrl.includes("/records/web")) {
  //   throw new Error(`❌ Invalid report page. URL: ${currentUrl}, Title: ${currentTitle}`);
  // }

  console.log("✅ Verified report page:", currentUrl);
}

// 📧 Locate and click email <td> by match
async function clickEmailRow(page, email) {
  console.log("📬 Waiting for email rows to load...");
  await page.waitForSelector('td[elem_linkname="Email_td"] a', { timeout: 15000 });

  const clicked = await page.evaluate((targetEmail) => {
    const anchors = [...document.querySelectorAll('td[elem_linkname="Email_td"] a')];
    const match = anchors.find(a => a.textContent.trim() === targetEmail);
    if (match) {
      match.closest('td')?.click();
      return true;
    }
    return false;
  }, email);

  if (!clicked) throw new Error(`❌ Could not click email row for: ${email}`);
  console.log(`✅ Clicked on record row for email: ${email}`);
}

// 📎 Get download links from record summary
async function extractDownloadLinks(page) {
  console.log("📄 Waiting for record summary to appear...");
  await page.waitForFunction(() => {
    const el = document.querySelector("#recordSumContainerId");
    return el && el.offsetParent !== null;
  }, { timeout: 20000 });

  const links = await page.$$eval('a[elname="download"]', anchors =>
    anchors
      .filter(a => a.href.startsWith("https://download.zoho.in/webdownload"))
      .map(a => a.href)
  );

  console.log("🔗 Download links extracted:", links.length);
  return links;
}

// ⬇️ Click each download link to trigger image downloads
async function triggerDownloads(page, links) {
  console.log("⬇️ Triggering file downloads...");
  for (const href of links) {
    await page.evaluate(h => {
      const el = [...document.querySelectorAll('a[elname="download"]')].find(a => a.href === h);
      el?.click();
    }, href);
    console.log("✅ Download clicked:", href);
    await new Promise(r => setTimeout(r, 1000));
  }
}
