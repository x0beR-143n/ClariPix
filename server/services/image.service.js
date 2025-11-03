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

module.exports = {
    createImageRecordInDB,
}