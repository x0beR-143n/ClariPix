const { StatusCodes } = require('http-status-codes');
const imageService = require('../services/image.service');
const multer = require('multer'); // To handle image uploads

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

async function uploadImage(req, res) {
    try {
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'error',
                message: 'No files were uploaded.'
            });
        }

        const uploader_id = req.user.userId;

        const { description } = req.body;
        // Single file upload
        const { buffer, originalname, mimetype } = req.file;

        const imageRecord = await imageService.createImageRecordInDB({
            uploader_id,
            fileBuffer: buffer,
            originalName: originalname,
            mimeType: mimetype,
            description
        });

        res.status(StatusCodes.CREATED).json({
            status: 'success',
            message: 'Image uploaded successfully',
            data: imageRecord
        });
    } catch (error) {
        console.error('Error in uploadImage controller:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to upload image. ' + error.message
        });
    }
}

async function deleteImage(req, res) {
    try {
        const { imageId } = req.params;

        const userId = req.user.userId;

        await imageService.deleteImageFromS3(userId, imageId);

        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteImage controller:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to delete image. ' + error.message
        });
    }
}

async function incrementViewCount(req, res) {
    try {
        const { imageId } = req.params;
        const userId = req.user.userId;

        const result = await imageService.incrementView(userId, imageId);
        let message = 'View count incremented successfully';
        if (!result) {
            message = 'Already viewed this. View count not incremented.';
        }
        res.status(StatusCodes.OK).json({
            status: 'success',
            message: message
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to increment view count. ' + error.message
        });
    }
}

const uploadMiddleware = upload.single('image'); // Order of middleware matters: first multer, then the controller

module.exports = {
    uploadImage,
    uploadMiddleware,
    deleteImage,
    incrementViewCount
};