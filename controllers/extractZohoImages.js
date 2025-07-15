const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const ZOHO_USERNAME = process.env.ZOHO_USERNAME;
const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD;
const ZOHO_URL = "https://forms.zoho.in/tufmachine1/report/DEMOFORM_Report/records/web";

exports.extractZohoImages = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.error("❌ Email not provided in request");
    return res.status(400).json({ error: "Email is required" });
  }

  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
  const downloadDir = path.join(os.tmpdir(), `zoho_images_${safeEmail}`);
  fs.ensureDirSync(downloadDir);
  console.log("📁 Download directory created:", downloadDir);

  let browser;
  try {
    console.log("🚀 Launching browser...");
    const result = await launchBrowser(downloadDir);
    browser = result.browser;
    const page = result.page;
    console.log("✅ Browser launched");

    await spoofBrowser(page);
    console.log("🕵️ Browser spoofed");

    await loginToZoho(page);
    console.log("🔓 Login successful");

    await navigateToReportPage(page);
    console.log("📄 Navigated to Zoho report page");

    await clickEmailRow(page, email);
    console.log("✅ Clicked row for email:", email);

    const downloadLinks = await extractDownloadLinks(page);
    console.log("📎 Download links found:", downloadLinks.length);

    if (!downloadLinks.length) {
      console.log("❌ No download links available");
      return res.status(404).json({ message: "❌ No download links found" });
    }

    await triggerDownloads(page, downloadLinks);
    console.log("⬇️ All download links triggered");

    res.status(200).json({
      message: "✅ Images download triggered successfully",
      files: downloadLinks.length,
      savedTo: downloadDir,
    });
  } catch (error) {
    console.error("❌ Error during extraction:", error.message);
    res.status(500).json({ message: "Failed to extract images", error: error.message });
  } finally {
    if (browser) {
      await browser.close();
      console.log("🛑 Browser closed");
    }
  }
};

async function launchBrowser(downloadDir) {
  console.log("🧱 Setting up Puppeteer...");
  const browser = await puppeteer.launch({
    headless: "true",
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
  console.log("💾 Download behavior configured");

  return { browser, page };
}

async function spoofBrowser(page) {
  console.log("🛡️ Applying spoofing techniques...");
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0 Safari/537.36");
  await page.setJavaScriptEnabled(true);
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
}

async function loginToZoho(page) {
  console.log("🌐 Opening Zoho login page...");
  await page.goto("https://accounts.zoho.in/signin?servicename=ZohoForms&signupurl=https://www.zoho.com/forms/signup.html&serviceurl=https://forms.zoho.in", {
    waitUntil: "networkidle2",
  });
  console.log("🔑 Login page URL:", page.url());

  // Enter username
  console.log("✍️ Typing username...");
  await page.type("#login_id", ZOHO_USERNAME);
  await page.keyboard.press("Enter");
  console.log("✅ Username entered:", ZOHO_USERNAME);
  await new Promise(r => setTimeout(r, 500));

  // Wait and enter password
  console.log("✍️ Waiting for password input...");
  await page.waitForSelector("#password", { visible: true, timeout: 10000 });
  await page.type("#password", ZOHO_PASSWORD);
  console.log("✅ Password entered");
  await new Promise(r => setTimeout(r, 1000));

await page.keyboard.press("Enter");
  await new Promise(r => setTimeout(r, 1000));


  // Try clicking the login button manually
  // const loginButton = await page.$("#nextbtn");
  // if (loginButton) {
  //   console.log("➡️ Clicking #nextbtn...");
  //   await loginButton.click();
  // } else {
  //   console.log("Next Button Not found");
  // }

  // Wait for successful redirect (Zoho sometimes takes time)
  try {
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 });
    console.log("✅ Navigation after login:", page.url());
  } catch (err) {
    console.warn("⚠️ No redirect after login — may already be authenticated or blocked");
  }

  await page.waitForTimeout(2000);
}

async function navigateToReportPage(page) {
  console.log("📥 Navigating to initial Zoho report URL...");
  await page.goto(ZOHO_URL, { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 500));

  let currentUrl = page.url();


    console.log("Current URL:", currentUrl);

    // Click the "Access Zoho Forms" button if present
    const buttonExists = await page.$('a.act-btn.cta-btn[href="https://forms.zoho.in"]');
    if (buttonExists) {
      console.log("➡️ Clicking 'Access Zoho Forms' button...");
      await page.click('a.act-btn.cta-btn[href="https://forms.zoho.in"]');
      await page.waitForNavigation({ waitUntil: "networkidle2" });
    }

      await page.goto(ZOHO_URL, { waitUntil: "networkidle2" });
      await new Promise(r => setTimeout(r, 500));
  

  console.log("✅ Report page loaded:", currentUrl);
}


async function clickEmailRow(page, email) {
  console.log("🔍 Searching for email row:", email);
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

async function extractDownloadLinks(page) {
  console.log("⏳ Waiting for record summary panel...");
  await page.waitForFunction(() => {
    const el = document.querySelector("#recordSumContainerId");
    return el && el.offsetParent !== null;
  }, { timeout: 20000 });

  const links = await page.$$eval('a[elname="download"]', anchors =>
    anchors
      .filter(a => a.href.startsWith("https://download.zoho.in/webdownload"))
      .map(a => a.href)
  );

  console.log("🔗 Extracted download links:", links.length);
  return links;
}

async function triggerDownloads(page, links) {
  console.log("🚚 Triggering file downloads...");
  for (const href of links) {
    console.log("⬇️ Downloading:", href);
    await page.evaluate(href => {
      const el = [...document.querySelectorAll('a[elname="download"]')].find(a => a.href === href);
      el?.click();
    }, href);
    await new Promise(r => setTimeout(r, 1000));
  }
}
