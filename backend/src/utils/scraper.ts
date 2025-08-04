import puppeteer from 'puppeteer';

export async function getPreviewHTML(url: string): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true, // or true
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (compatible; LinkPreviewBot/1.0)");
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

    // Try to extract OG tags
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

    // Fallback to screenshot if no OG metadata
    let screenshotBase64 = '';
    if (!metadata.title && !metadata.description && !metadata.image) {
      const screenshot = await page.screenshot({ type: 'jpeg', fullPage: false });
      screenshotBase64 = `data:image/jpeg;base64,${Buffer.from(screenshot).toString('base64')}`;
    }

    await browser.close();

    return `
      <div style="border:1px solid #ccc;padding:12px;border-radius:8px;max-width:500px;">
        <a href="${url}" target="_blank" style="text-decoration:none;color:inherit;">
          <strong style="font-size:1.1rem;">${metadata.title}</strong>
          <p style="color:gray;">${metadata.description}</p>
          ${
            metadata.image
              ? `<img src="${metadata.image}" alt="preview" style="width:100%;border-radius:4px;" />`
              : screenshotBase64
              ? `<img src="${screenshotBase64}" alt="screenshot" style="width:100%;border-radius:4px;" />`
              : ''
          }
        </a>
      </div>
    `;
  } catch (err) {
    await browser.close();
    console.error("Error fetching preview:", err);
    throw err;
  }
}
