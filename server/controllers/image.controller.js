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

        // Handle multiple file uploads
        const uploadPromises = req.files.map(file => {
            const { buffer, originalname, mimetype } = file;
            return imageService.createImageRecordInDB({
                uploader_id,
                fileBuffer: buffer,
                originalName: originalname,
                mimeType: mimetype,
                description
            });
        });
        const imageRecords = await Promise.all(uploadPromises);

        // Single file upload
        // const { buffer, originalname, mimetype } = req.file;
        //
        // const imageRecord = await imageService.createImageRecordInDB({
        //     uploader_id,
        //     fileBuffer: buffer,
        //     originalName: originalname,
        //     mimeType: mimetype,
        //     description
        // });

        res.status(StatusCodes.CREATED).json({
            status: 'success',
            message: `Successfully uploaded ${imageRecords.length} image(s)`,
            data: imageRecords
        });
    } catch (error) {
        console.error('Error in uploadImage controller:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to upload images. ' + error.message
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

// async function incrementViewCount(req, res) {
//     try {
//         const { imageId } = req.params;
//         const userId = req.user.userId;
//
//         const result = await imageService.incrementView(userId, imageId);
//         let message = 'View count incremented successfully';
//         if (!result) {
//             message = 'Already viewed this. View count not incremented.';
//         }
//         res.status(StatusCodes.OK).json({
//             status: 'success',
//             message: message
//         });
//     } catch (error) {
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             status: 'error',
//             message: 'Failed to increment view count. ' + error.message
//         });
//     }
// }

async function getImagesWithPagination(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sorter = req.query.sorter || 'created_at';
        const order = req.query.order || 'DESC';

        const images = await imageService.getImagesWithPagination(page, limit, sorter, order);
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: images
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to retrieve images. ' + error.message
        });
    }
}

async function getImageById(req, res) {
    try {
        const { imageId } = req.params;
        const userId = req.user?.userId;

        // Get image and increment view count
        const image = await imageService.getImageById(imageId, userId);

        if (!image) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: 'error',
                message: 'Image not found'
            });
        }

        res.status(StatusCodes.OK).json({
            status: 'success',
            data: image
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to retrieve image. ' + error.message
        });
    }
}

const uploadMiddleware = upload.single('image', 10); // Order of middleware matters: first multer, then the controller

module.exports = {
    uploadImage,
    uploadMiddleware,
    deleteImage,
    getImagesWithPagination,
    getImageById
};