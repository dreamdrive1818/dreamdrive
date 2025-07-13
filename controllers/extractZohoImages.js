const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const ZOHO_USERNAME = process.env.ZOHO_USERNAME;
const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD;
const ZOHO_URL = "https://forms.zoho.in/tufmachine1/report/DEMOFORM_Report/records/web";

exports.extractZohoImages = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
  const downloadDir = path.join(os.tmpdir(), `zoho_images_${safeEmail}`);
  fs.ensureDirSync(downloadDir);

  let browser;
  try {
    browser = await launchBrowser(downloadDir);
    const [page] = await browser.pages();

    await spoofBrowser(page);
    await loginToZoho(page);
    await navigateToReportPage(page);
    await clickEmailRow(page, email);

    const downloadLinks = await extractDownloadLinks(page);
    if (!downloadLinks.length) {
      return res.status(404).json({ message: "❌ No download links found" });
    }

    await triggerDownloads(page, downloadLinks);

    res.status(200).json({
      message: "✅ Images download triggered successfully",
      files: downloadLinks.length,
      savedTo: downloadDir,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "Failed to extract images", error: error.message });
  } finally {
    if (browser) await browser.close();
  }
};

// Launch Puppeteer and setup download path
async function launchBrowser(downloadDir) {
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

  return browser;
}

// Prevent Puppeteer detection
async function spoofBrowser(page) {
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0 Safari/537.36");
  await page.setJavaScriptEnabled(true);
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
}

// Zoho login logic
async function loginToZoho(page) {
  await page.goto("https://accounts.zoho.in/signin?servicename=ZohoForms", { waitUntil: "networkidle2" });

  await page.type("#login_id", ZOHO_USERNAME);
  await page.keyboard.press("Enter");

  await page.waitForSelector("#password", { visible: true });
  await page.type("#password", ZOHO_PASSWORD);
  await page.keyboard.press("Enter");

  try {
    await page.waitForSelector("#nextbtn", { visible: true, timeout: 5000 });
    await page.click("#nextbtn");
    await new Promise(r => setTimeout(r, 1500));
  } catch (e) {
    console.warn("⚠️ #nextbtn not found or skipped");
  }
}

// Go to Zoho report page with retry
async function navigateToReportPage(page) {
  await page.goto(ZOHO_URL, { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 400));

  let currentUrl = page.url();
  let retries = 0;

  while (
    currentUrl.includes("https://www.zoho.com/forms/?serviceurl=") &&
    retries < 3
  ) {
    await page.goto("https://forms.zoho.in/", { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 400));
    await page.goto(ZOHO_URL, { waitUntil: "networkidle2" });
    currentUrl = page.url();
    retries++;
  }

  if (!currentUrl.includes("/report/") || !currentUrl.includes("/records/web")) {
    throw new Error(`❌ Invalid report page: ${currentUrl}`);
  }
}

// Click the email row to open record
async function clickEmailRow(page, email) {
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

  if (!clicked) throw new Error(`❌ Email row not found: ${email}`);
}

// Get all valid download URLs
async function extractDownloadLinks(page) {
  await page.waitForFunction(() => {
    const el = document.querySelector("#recordSumContainerId");
    return el && el.offsetParent !== null;
  }, { timeout: 20000 });

  return await page.$$eval('a[elname="download"]', anchors =>
    anchors
      .filter(a => a.href.startsWith("https://download.zoho.in/webdownload"))
      .map(a => a.href)
  );
}

// Click each download link
async function triggerDownloads(page, links) {
  for (const href of links) {
    await page.evaluate(href => {
      const el = [...document.querySelectorAll('a[elname="download"]')].find(a => a.href === href);
      el?.click();
    }, href);
    await new Promise(r => setTimeout(r, 1000));
  }
}
