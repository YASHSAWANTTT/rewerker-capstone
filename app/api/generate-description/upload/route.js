import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const { imageBase64 } = await req.json();

  if (!imageBase64) {
    return NextResponse.json({ error: "Image base64 is required" }, { status: 400 });
  }

  try {
    const uploadResponse = await cloudinary.v2.uploader.upload(imageBase64, {
      folder: "your-folder-name", // Optional: specify a Cloudinary folder
    });
    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
