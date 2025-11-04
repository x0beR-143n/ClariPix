const AWS = require('aws-sdk');
const { v4: uuidv4 } = require("uuid");
const Image = require("../models/image.model");

const s3 = new AWS.S3({
    region: process.env.AWS_REGION || 'ap-southeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function uploadToS3(fileBuffer, originalName, mimeType) {
    // Create a unique file path
    const now = new Date();
    const datePath = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const uniqueKey = `uploads/${datePath}/${Date.now()}-${uuidv4()}-${originalName.replace(/\s+/g, '_')}`;

    // Upload to S3
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uniqueKey,
        Body: fileBuffer,
        ContentType: mimeType
    };

    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location; // Return the S3 URL
}

async function createImageRecordInDB(imageData) {
    const { uploader_id, fileBuffer, originalName, mimeType, description } = imageData;

    // Upload image to S3
    const imageUrl = await uploadToS3(fileBuffer, originalName, mimeType);

    try {
        // Create image record in DB
        const imageRecord = await Image.create({
            uploader_id,
            image_url: imageUrl,
            description,
            // Other fields can be set later after GCP vision call
        });

        console.log('Image record created successfully. The location is:', imageUrl);
        return imageRecord;
    } catch (error) {
        console.error('Error creating image record in DB:', error);
        throw error;
    }
}

async function deleteImageFromS3(imageId) {
    try {
        // Find image record in DB
        const imageRecord = await Image.findByPk(imageId);
        if (!imageRecord) {
            throw new Error('Image not found');
        }

        // Extract the S3 key from the image URL
        const imageUrl = imageRecord.image_url;
        const bucketName = process.env.AWS_BUCKET_NAME;
        const urlParts = new URL(imageUrl);
        const s3Key = urlParts.pathname.substring(1); // Remove leading '/'
        console.log("Found the corresponding S3 key: ", s3Key);

        // Delete from S3
        const params = {
            Bucket: bucketName,
            Key: s3Key,
        };

        await s3.deleteObject(params).promise();
        console.log('Deleted image successfully from S3: ', imageUrl);

        // Delete record from DB
        await imageRecord.destroy();
        console.log('Deleted image record successfully from DB: ', imageId);
    } catch (error) {
        console.error('Error deleting image from S3 or DB:', error);
    }
}

module.exports = {
    createImageRecordInDB,
    deleteImageFromS3
}