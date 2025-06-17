import { NextApiRequest, NextApiResponse } from "next";
import { put } from "@vercel/blob";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if blob token exists
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    
    if (!blobToken) {
      return res.status(500).json({ 
        error: "BLOB_READ_WRITE_TOKEN not configured",
        hasToken: false 
      });
    }

    // Try a simple blob operation to test if it works
    const testBlob = await put("test/debug.txt", "Hello from Papermark debug", {
      access: "public",
      token: blobToken,
    });

    return res.status(200).json({ 
      success: true,
      hasToken: true,
      tokenPrefix: blobToken.substring(0, 20) + "...",
      testBlob: {
        url: testBlob.url,
        pathname: testBlob.pathname,
      }
    });
  } catch (error) {
    console.error("Blob debug error:", error);
    return res.status(500).json({ 
      error: "Blob operation failed",
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}