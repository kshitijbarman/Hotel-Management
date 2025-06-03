 
const cloudinary = require("../config/cloudinary");
const sharp = require("sharp");

const uploadToCloudinary = async (buffer, originalname) => {
  try {
    
    const resizedBuffer = await sharp(buffer)
      .resize({ width: 1024 })  
      .jpeg({ quality: 80 })  
      .toBuffer();

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "hotel_rooms",
          resource_type: "image",
          timeout: 180000,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(resizedBuffer);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

module.exports = { uploadToCloudinary };
