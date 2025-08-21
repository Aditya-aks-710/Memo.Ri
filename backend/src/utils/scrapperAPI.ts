import axios from "axios";

interface IframelyResponse {
  meta: {
    title?: string;
    description?: string;
  };
  links?: {
    thumbnail?: { href: string }[];
  };
  html?: string;
}

export async function getPreviewHTML(url: string): Promise<string> {
  try {
    const IFRAMELY_API_KEY = process.env.IFRAMELY_API_KEY;
    if (!IFRAMELY_API_KEY) throw new Error("Iframely API key not set in env variables.");

    // Call Iframely API with media=0 to get static card (no video/audio)
    const response = await axios.get<IframelyResponse>(
      `https://iframe.ly/api/iframely?url=${encodeURIComponent(url)}&api_key=${IFRAMELY_API_KEY}&media=0`
    );

    const data = response.data;

    const title = data.meta?.title || "No title";
    const description = data.meta?.description || "No description available";
    const image = data.links?.thumbnail?.[0]?.href || 
                  "https://res.cloudinary.com/drqcrqxnz/image/upload/v1755367727/broken-image_txrjqr.png";

    // Return the same card HTML as before
    return `
      <div style="border:1px solid #ccc;padding:12px;border-radius:8px;width:100%">
        <a href="${url}" target="_blank" style="text-decoration:none;color:inherit;display:block;">
          <strong style="font-size:1.1rem;margin-bottom:4px;display:block;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${title}
          </strong>
          <p style="font-size:0.9rem;color:#555;margin:4px 0;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${description}
          </p>
          <div style="height:150px;max-height:150px;overflow:hidden;border-radius:4px;">
            <img src="${image}" alt="preview" style="width:100%;height:100%;object-fit:cover;" />
          </div>
        </a>
      </div>
    `;
  } catch (err) {
    console.error(`Error fetching Iframely preview for ${url}:`, err);

    // Return a fallback error card
    return `
      <div style="border:1px solid #ccc;padding:12px;border-radius:8px;width:100%; color: #888;">
        Could not generate a preview for this link.
      </div>
    `;
  }
}
