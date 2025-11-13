const { StatusCodes } = require('http-status-codes');
const imageService = require('../services/image.service');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Unified upload handler: supports both single and multiple files
async function uploadImage(req, res) {
  try {
    const uploader_id = req.user.userId;

    // Parse descriptions from body in various formats
    let descriptionsArr = null;
    if (req.body) {
      // descriptions[0], descriptions[1] ...
      const bracketMap = [];
      Object.keys(req.body).forEach((key) => {
        const m = key.match(/^descriptions\[(\d+)\]$/);
        if (m) {
          const idx = parseInt(m[1], 10);
          bracketMap[idx] = req.body[key];
        }
      });
      if (bracketMap.length) {
        descriptionsArr = bracketMap;
      } else if (req.body.descriptions) {
        const src = req.body.descriptions;
        if (Array.isArray(src)) {
          descriptionsArr = src;
        } else if (typeof src === 'string') {
          try {
            const trimmed = src.trim();
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
              const parsed = JSON.parse(trimmed);
              descriptionsArr = Array.isArray(parsed) ? parsed : [parsed];
            } else if (trimmed.includes(',')) {
              descriptionsArr = trimmed.split(',').map((s) => s.trim());
            } else {
              descriptionsArr = [trimmed];
            }
          } catch (e) {
            descriptionsArr = src.includes(',') ? src.split(',').map((s) => s.trim()) : [src];
          }
        }
      }
    }

    // Multiple files
    if (Array.isArray(req.files) && req.files.length) {
      const results = await Promise.all(
        req.files.map(({ buffer, originalname, mimetype }, idx) => {
          const perDesc = descriptionsArr?.[idx] ?? '';
          return imageService.createImageRecordInDB({
            uploader_id,
            fileBuffer: buffer,
            originalName: originalname,
            mimeType: mimetype,
            description: perDesc,
          });
        })
      );
      return res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: `Successfully uploaded ${results.length} image(s)`,
        data: results,
      });
    }

    // Single file
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'No files were uploaded.',
      });
    }
    const { description } = req.body;
    const { buffer, originalname, mimetype } = req.file;
    const imageRecord = await imageService.createImageRecordInDB({
      uploader_id,
      fileBuffer: buffer,
      originalName: originalname,
      mimeType: mimetype,
      description: (descriptionsArr && descriptionsArr[0]) ?? description ?? '',
    });
    return res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: imageRecord,
    });
  } catch (error) {
    console.error('Error in uploadImage controller:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to upload image(s). ' + error.message,
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
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteImage controller:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to delete image. ' + error.message,
    });
  }
}

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
    const userId = req.user?.userId;
    const image = await imageService.getImageById(imageId, userId);
    if (!image) {
      return res.status(StatusCodes.NOT_FOUND).json({ status: 'error', message: 'Image not found' });
    }
    res.status(StatusCodes.OK).json({ status: 'success', data: image });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to retrieve image. ' + error.message,
    });
  }
}

// Middlewares for single vs multiple uploads
const uploadMiddleware = upload.single('image');
const uploadMultipleMiddleware = upload.array('images', 10);

module.exports = {
  uploadImage,
  uploadMiddleware,
  uploadMultipleMiddleware,
  deleteImage,
  getImagesWithPagination,
  getImageById,
};
