import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('image');

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({}, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }).end(buffer);
    });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return new Response("Failed to upload image", { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import cloudinary from "cloudinary";

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req) {
//   const { imageBase64 } = await req.json();

//   if (!imageBase64) {
//     return NextResponse.json({ error: "Image base64 is required" }, { status: 400 });
//   }

//   try {
//     const uploadResponse = await cloudinary.v2.uploader.upload(imageBase64, {
//       folder: "your-folder-name", // Optional: specify a Cloudinary folder
//     });
//     return NextResponse.json({ url: uploadResponse.secure_url });
//   } catch (error) {
//     console.error("Cloudinary Upload Error:", error);
//     return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
//   }
// }


