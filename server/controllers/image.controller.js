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


        const { uploader_id, description } = req.body;
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
            message: 'Failed to upload image'
        });
    }
}

async function deleteImage(req, res) {
    try {
        const { imageId } = req.params;

        await imageService.deleteImageFromS3(imageId);

        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteImage controller:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to delete image'
        });
    }
}

const uploadMiddleware = upload.single('image'); // Order of middleware matters: first multer, then the controller

module.exports = {
    uploadImage,
    uploadMiddleware,
    deleteImage
};