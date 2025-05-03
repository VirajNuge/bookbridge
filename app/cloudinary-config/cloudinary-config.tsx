"use client";
import { CldImage } from "next-cloudinary";

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function Page() {
  return (
    <CldImage
      src="cld-sample-5" // Use this sample image or upload your own via the Media Explorer
      width="500" // Transform the image: auto-crop to square aspect_ratio
      height="500"
      alt="Sample Cloudinary image"
      crop={{
        type: "auto",
        source: true,
      }}
    />
  );
}

export const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/dipztwslj/upload`;
export const uploadPreset = "bookimages";
