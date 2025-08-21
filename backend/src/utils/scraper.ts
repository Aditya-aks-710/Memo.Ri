import puppeteer from "puppeteer";

export async function getPreviewHTML(url: string): Promise<string> {
  // Launch Puppeteer. It will automatically find the browser
  // installed by the Dockerfile.
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (compatible; LinkPreviewBot/1.0; +https://github.com/your-repo)");

    // --- THIS IS THE KEY FIX for Infinite Scroll ---
    // 1. Go to the page and wait only for the initial HTML to be ready.
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // 2. Wait specifically for the meta tags we need. This is more reliable
    // than waiting for the whole page to load, especially on infinite-scroll sites.
    // It will wait until either the 'og:title' or 'og:image' tag appears.
    await page.waitForSelector(
      'head meta[property="og:title"], head meta[property="og:image"]',
      { timeout: 30000 } // Give it 15 seconds to find the tags
    );

    // Extract metadata
    const metadata = await page.evaluate(() => {
      const getMeta = (name: string) =>
        document.querySelector(`meta[property="${name}"]`)?.getAttribute("content") ||
        document.querySelector(`meta[name="${name}"]`)?.getAttribute("content");

      return {
        title: getMeta("og:title") || document.title || "No title",
        description: getMeta("og:description") || "",
        image: getMeta("og:image") || ""
      };
    });

    // Optional screenshot fallback
    let screenshotBase64 = "";
    if (!metadata.title && !metadata.description && !metadata.image) {
      const screenshot = await page.screenshot({ type: "jpeg", fullPage: false });
      screenshotBase64 = `data:image/jpeg;base64,${Buffer.from(screenshot).toString("base64")}`;
    }

    await browser.close();

    return `
      <div style="border:1px solid #ccc;padding:12px;border-radius:8px;width:100%">
        <a href="${url}" target="_blank" style="text-decoration:none;color:inherit;display:block;">
          <strong style="font-size:1.1rem;margin-bottom:4px;display:block;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${metadata.title || "No title"}
          </strong>
          <p style="font-size:0.9rem;color:#555;margin:4px 0;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${metadata.description || "No description"}
          </p>
          ${
            metadata.image
              ? `<div style="height:150px;max-height:150px;overflow:hidden;border-radius:4px;">
                   <img src="${metadata.image}" alt="preview" style="width:100%;height:100%;object-fit:cover;" />
                 </div>`
              : screenshotBase64
              ? `<div style="height:150px;max-height:150px;overflow:hidden;border-radius:4px;">
                   <img src="${screenshotBase64}" alt="screenshot" style="width:100%;height:100%;object-fit:cover;" />
                 </div>`
              : `<div style="height:150px;max-height:150px;overflow:hidden;border-radius:4px;">
                   <img src="https://res.cloudinary.com/drqcrqxnz/image/upload/v1755367727/broken-image_txrjqr.png" alt="screenshot" style="width:100%;height:100%;object-fit:cover;" />
                 </div>`
          }
        </a>
      </div>
    `;
  } catch (err) {
    if (browser) {
      await browser.close();
    }
    console.error("Error fetching preview:", err);
    throw err;
  }
}
