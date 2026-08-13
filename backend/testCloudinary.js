import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log("Cloud:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Key exists:", !!process.env.CLOUDINARY_API_KEY);
console.log("Secret exists:", !!process.env.CLOUDINARY_API_SECRET);

try {
  const result = await cloudinary.uploader.upload(
    "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    {
      resource_type: "image",
    }
  );

  console.log("UPLOAD SUCCESS");
  console.log(result.secure_url);
} catch (error) {
  console.log("STATUS:", error.http_code);
  console.log("MESSAGE:", error.message);
  console.log("NAME:", error.name);
  console.log("ERROR:", error);
}