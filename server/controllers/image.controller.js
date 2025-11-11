const { StatusCodes } = require('http-status-codes');
const imageService = require('../services/image.service');
const multer = require('multer'); // To handle image uploads

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

async function uploadImage(req, res) {
    try {
        const uploader_id = req.user.userId;
        console.log('Uploader ID:', uploader_id);
        const { description } = req.body;
        let descriptionsArr = null;
        if (req.body && req.body.descriptions) {
            try {
                const parsed = JSON.parse(req.body.descriptions);
                if (Array.isArray(parsed)) descriptionsArr = parsed;
            } catch (e) {
                console.warn('Failed to parse descriptions JSON:', e?.message);
            }
        }

        // If multiple files present
        if (Array.isArray(req.files) && req.files.length) {
            const results = await Promise.all(
                req.files.map(({ buffer, originalname, mimetype }, idx) => {
                    const perDesc = descriptionsArr?.[idx] ?? description;
                    return imageService.createImageRecordInDB({
                        uploader_id,
                        fileBuffer: buffer,
                        originalName: originalname,
                        mimeType: mimetype,
                        description: perDesc
                    })
                })
            );
            return res.status(StatusCodes.CREATED).json({
                status: 'success',
                message: `Successfully uploaded ${results.length} image(s)`,
                data: results
            });
        }

        // Fallback to single file
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'error',
                message: 'No files were uploaded.'
            });
        }

        const { buffer, originalname, mimetype } = req.file;
        const imageRecord = await imageService.createImageRecordInDB({
            uploader_id,
            fileBuffer: buffer,
            originalName: originalname,
            mimeType: mimetype,
            description
        });

        return res.status(StatusCodes.CREATED).json({
            status: 'success',
            message: 'Image uploaded successfully',
            data: imageRecord
        });
    } catch (error) {
        console.error('Error in uploadImage controller:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to upload image(s). ' + error.message
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

// Middlewares for single vs multiple uploads
const uploadMiddleware = upload.single('image');
const uploadMultipleMiddleware = upload.array('images', 10); // up to 10 files per request

module.exports = {
    uploadImage,
    uploadMiddleware,
    uploadMultipleMiddleware,
    deleteImage,
    getImagesWithPagination,
    getImageById
};
