const { StatusCodes } = require('http-status-codes');
const imageService = require('../services/image.service');
const multer = require('multer'); // To handle image uploads

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

async function uploadSingleImage(req, res) {
    try {
        const uploader_id = req.user.userId;
        console.log('Uploader ID:', uploader_id);

        // Xử lý descriptions cho nhiều ảnh - FIX: xử lý đúng cách
        let descriptionsArr = [];
        if (req.body && req.body.descriptions) {
            try {
                // Thử parse như JSON trước
                if (typeof req.body.descriptions === 'string') {
                    // Loại bỏ khoảng trắng thừa và thử parse JSON
                    const trimmed = req.body.descriptions.trim();

                    // Kiểm tra nếu bắt đầu bằng [ và kết thúc bằng ] thì là JSON array
                    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                        const parsed = JSON.parse(trimmed);
                        if (Array.isArray(parsed)) {
                            descriptionsArr = parsed;
                        } else {
                            descriptionsArr = [parsed];
                        }
                    } else {
                        // Nếu không phải JSON array, split bằng dấu phẩy
                        descriptionsArr = trimmed.split(',').map(desc => desc.trim());
                    }
                }
                // Nếu descriptions đã là array (trường hợp hiếm)
                else if (Array.isArray(req.body.descriptions)) {
                    descriptionsArr = req.body.descriptions;
                }
            } catch (e) {
                console.warn('Failed to parse descriptions, splitting by comma:', e?.message);
                // Nếu parse thất bại, split bằng dấu phẩy
                descriptionsArr = req.body.descriptions.split(',').map(desc => desc.trim());
            }
        }

        console.log('Processed descriptions:', descriptionsArr);

        // Chỉ xử lý multiple files
        if (!req.files || req.files.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'error',
                message: 'No file was uploaded.'
            });
        }

        // const uploader_id = req.user.userId;
        const { description } = req.body;

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
            message: 'Successfully uploaded 1 image',
            data: imageRecord
        });
    } catch (error) {
        console.error('Error in uploadSingleImage controller:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to upload image. ' + error.message
        });
    }
}

async function uploadMultipleImages(req, res) {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'error',
                message: 'No files were uploaded.'
            });
        }

        const results = await Promise.all(
            req.files.map(({ buffer, originalname, mimetype }, idx) => {
                // Lấy description tương ứng cho từng ảnh
                const perDesc = descriptionsArr[idx] || '';

                return imageService.createImageRecordInDB({
                    uploader_id,
                    fileBuffer: buffer,
                    originalName: originalname,
                    mimeType: mimetype,
                    description: perDesc
                });
            })
        );

        return res.status(StatusCodes.CREATED).json({
            status: 'success',
            message: `Successfully uploaded ${results.length} image(s)`,
            data: results
        });
    } catch (error) {
        console.error('Error in uploadMultipleImages controller:', error);
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

        // Nhận queries từ querystring:
        // Hỗ trợ nhiều kiểu: ?queries[]=a&queries[]=b  hoặc ?queries='["a","b"]'  hoặc ?queries=a,b
        let queries = [];
        if (req.query.queries) {
            if (Array.isArray(req.query.queries)) {
                queries = req.query.queries;
            } else if (typeof req.query.queries === 'string') {
                const raw = req.query.queries.trim();
                // Try parse JSON array string first
                try {
                    if ((raw.startsWith('[') && raw.endsWith(']')) || raw.startsWith('"')) {
                        const parsed = JSON.parse(raw);
                        if (Array.isArray(parsed)) {
                            queries = parsed;
                        } else if (typeof parsed === 'string') {
                            queries = [parsed];
                        }
                    } else {
                        // comma separated
                        queries = raw.split(',').map(s => s.trim()).filter(Boolean);
                    }
                } catch (e) {
                    // fallback: split by comma
                    queries = raw.split(',').map(s => s.trim()).filter(Boolean);
                }
            }
        }

        // Gọi service (bổ sung param queries)
        const images = await imageService.getImagesWithPagination(page, limit, sorter, order, queries);

        res.status(StatusCodes.OK).json({
            status: 'success',
            data: images
        });
    } catch (error) {
        console.error('Error in getImagesWithPagination controller:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to retrieve images. ' + error.message
        });
    }
}

async function getImageById(req, res) {
    try {
        const { imageId } = req.params;
        const userId = req.user?.userId; // Có thể undefined nếu không đăng nhập

        // Get image và chỉ tăng view count nếu user đã đăng nhập
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
    uploadMultipleImages,
    uploadMiddleware,
    uploadMultipleMiddleware,
    deleteImage,
    getImagesWithPagination,
    getImageById
};
