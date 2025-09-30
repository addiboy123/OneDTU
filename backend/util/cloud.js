import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type'; // ✅ Correct named import

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60000
});

const compressImage = async (buffer) => {
    const type = await fileTypeFromBuffer(buffer);
    if (!type) throw new Error("Unable to detect image type.");

    switch (type.mime) {
        case "image/jpeg":
            return sharp(buffer).jpeg({ quality: 70 }).toBuffer();
        case "image/png":
            return sharp(buffer).png({ compressionLevel: 9 }).toBuffer();
        case "image/webp":
            return sharp(buffer).webp({ quality: 70 }).toBuffer();
        default:
            throw new Error(`Unsupported image format: ${type.mime}`);
    }
};

const uploadImage = async (fileBuffer) => {
    try {
        const compressedBuffer = await compressImage(fileBuffer);

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "image" },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                    } else {
                        console.log("Uploaded image");
                        resolve(result);
                    }
                }
            );
            stream.end(compressedBuffer);
        });
    } catch (error) {
        console.error("Compression/upload error:", error);
        throw error;
    }
};

const deleteFile = async (imageUrl) => {
    try {
        if (!imageUrl) throw new Error("No image URL provided");

        const publicId = getPublicIdFromUrl(imageUrl);
        if (!publicId) throw new Error("Invalid Cloudinary URL format");

        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        throw error;
    }
};

const getPublicIdFromUrl = (url) => {
    try {
        const parts = url.split("/");
        return parts[parts.length - 1].split(".")[0];
    } catch (error) {
        console.error("Error extracting public ID from URL:", error);
        return null;
    }
};

export { uploadImage, deleteFile };
