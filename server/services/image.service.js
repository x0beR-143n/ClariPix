const AWS = require('aws-sdk');
const Image = require("../models/image.model");
const ImageViewByUser = require("../models/imageViewByUser.model");
const { Op } = require('sequelize');

const s3 = new AWS.S3({
    region: process.env.AWS_REGION || 'ap-southeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function uploadToS3(uniqueKey, fileBuffer, mimeType) {
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
    const { uploader_id, fileBuffer, mimeType, description } = imageData;

    try {
        // Create image record in DB
        const imageRecord = await Image.create({
            uploader_id,
            image_url: "",
            description,
            // Other fields can be set later after GCP vision call
        });

        // Upload the image to S3
        const uniqueKey = `images/${imageRecord.id}`;
        const imageUrl = await uploadToS3(uniqueKey, fileBuffer, mimeType);

        // Update the image record with the S3 URL
        imageRecord.image_url = imageUrl;
        await imageRecord.save();

        console.log('Image record created successfully. The location is:', imageUrl);
        return imageRecord;
    } catch (error) {
        console.error('Error creating image record in DB:', error);
        throw error;
    }
}

async function deleteImageFromS3(userId, imageId) {
    try {
        // Find image record in DB
        const imageRecord = await Image.findByPk(imageId);
        if (!imageRecord) {
            throw new Error('Image not found');
        }

        if (imageRecord.uploader_id !== userId) {
            throw new Error('Unauthorized: You do not own this image');
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
        throw error;
    }
}

async function incrementView(userId, imageId) {
    try {
        // Only increment view if user is authenticated
        if (!userId) {
            return false;
        }

        const [viewRecord, created] = await ImageViewByUser.findOrCreate({
            where: { user_id: userId, image_id: imageId }
        });

        if (created) {
            // Use atomic increment to avoid race conditions
            await Image.increment('total_views', {
                where: { id: imageId }
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error adding view record:', error);
        throw error;
    }
}

async function getImageById(imageId, userId = null) {
    try {
        // First get the image
        const image = await Image.findByPk(imageId);

        if (!image) {
            return null;
        }

        // Only increase view if login (userId không null)
        if (userId) {
            try {
                await incrementView(userId, imageId);
                // Refresh the image to get updated view count
                await image.reload();
            } catch (error) {
                console.error('Error incrementing view:', error);
                // Continue even if view increment fails
            }
        }

        return image;
    } catch (error) {
        console.error('Error in getImageById service:', error);
        throw error;
    }
}

const THRESHOLD = 0.5;

async function getImagesWithPagination(page = 1, limit = 10, sorter = 'created_at', order = 'DESC', queries = []) {
    const offset = (page - 1) * limit;

    // Build common safe_score condition
    const safeCondition = {
        safe_score: {
            [Op.not]: null,
            [Op.gt]: THRESHOLD
        }
    };

    // Nếu queries là mảng và có phần tử: trả về 1 mảng chứa kết quả cho mỗi query
    if (Array.isArray(queries) && queries.length > 0) {
        // Map từng query -> tìm các ảnh với categories chứa query
        const results = await Promise.all(queries.map(async (q) => {
            // Nếu categories lưu dưới dạng Postgres array hoặc JSONB, Op.contains thường được dùng:
            // categories contains [q]
            const where = {
                ...safeCondition,
                categories: {
                    [Op.contains]: [q]
                }
            };

            return Image.findAll({
                where,
                offset,
                limit,
                order: [[sorter, order]]
            });
        }));

        // results là mảng các mảng ảnh
        return results;
    }

    // Nếu không có queries: trả về danh sách ảnh bình thường (1 mảng)
    const where = {
        ...safeCondition
    };

    const images = await Image.findAll({
        where,
        offset,
        limit,
        order: [[sorter, order]]
    });

    return images;
}

module.exports = {
    createImageRecordInDB,
    deleteImageFromS3,
    incrementView,
    getImagesWithPagination,
    getImageById
}