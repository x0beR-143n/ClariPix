/**
 * @swagger
 * tags:
 *   name: Images
 *   description: API cho quản lý ảnh người dùng (upload, xem, xóa, ...)
 */

const express = require("express");
const { body, validationResult, param, query} = require("express-validator");
const imageController = require("../controllers/image.controller");
const { authenticate } = require("../middleware/authenticate");

const router = express.Router();

// Validation middleware
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((v) => v.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) return next();

        res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: errors.array(),
        });
    };
};


// Validation rules
const uploadValidation = [
    body("description").optional().isString(),
];

/**
 * @swagger
 * /images/upload:
 *   post:
 *     summary: Upload ảnh mới của người dùng
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               description:
 *                 type: string
 *                 example: Mô tả về ảnh (tùy chọn)
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: a87f4e1a-d3b8-4f4f-9d62-5cbf78a7f9b9
 *                     created_at:
 *                       type: string
 *                       example: 2025-11-03T10:15:30.000Z
 *                     total_views:
 *                       type: integer
 *                       example: 0
 *                     total_likes:
 *                       type: integer
 *                       example: 0
 *                     status:
 *                       type: string
 *                       example: pending
 *                     uploader_id:
 *                       type: string
 *                       example: 71c9e45f-56ab-4f7b-93d7-fb19841e2b2b
 *                     image_url:
 *                       type: string
 *                       example: https://claripix-uploads.s3.ap-southeast-1.amazonaws.com/uploads/2025/11/03/abc.jpg
 *                     description:
 *                       type: string
 *                       example: Mô tả về ảnh (tùy chọn)
 *       400:
 *         description: Thiếu file hoặc dữ liệu không hợp lệ
 */

router.post(
    "/upload",
    authenticate,
    imageController.uploadMiddleware, // parse multipart/form-data
    validate(uploadValidation),
    imageController.uploadImage
);

const deleteValidation = [
    param('imageId')
        .notEmpty()
        .withMessage('imageId is required')
        .isUUID()
        .withMessage('imageId must be a valid UUID'),
];

/**
 * @swagger
 * /images/{imageId}:
 *   delete:
 *     summary: Xóa ảnh người dùng theo ID
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ảnh cần xóa
 *     responses:
 *       200:
 *         description: Xóa ảnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Image deleted successfully
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

router.delete(
    "/:imageId",
    authenticate,
    validate(deleteValidation),
    imageController.deleteImage
);


/**
 * @swagger
 * /images/{imageId}/view:
 *   post:
 *     summary: Tăng số lượt xem của ảnh
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ảnh
 *     responses:
 *       200:
 *         description: Lượt xem của ảnh đã được tăng
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

router.post(
    "/:imageId/view",
    authenticate,
    imageController.incrementViewCount
)


const paginationValidation = [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be an integer greater than 0'),
    query('limit').optional().isInt({ min: 1 }).withMessage('limit must be an integer greater than 0'),
    query('sorter').optional().isString().withMessage('sorter must be a string'),
    query('order').optional().isIn(['ASC', 'DESC']).withMessage('order must be either ASC or DESC'),
];

/**
 * @swagger
 * /images:
 *   get:
 *     summary: Lấy danh sách ảnh với phân trang
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số ảnh trên mỗi trang
 *       - in: query
 *         name: sorter
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Trường để sắp xếp ảnh
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Thứ tự sắp xếp
 *     responses:
 *       200:
 *         description: Danh sách ảnh với phân trang
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: a87f4e1a-d3b8-4f4f-9d62-5cbf78a7f9b9
 *                       uploader_id:
 *                         type: string
 *                         example: 71c9e45f-56ab-4f7b-93d7-fb19841e2b2b
 *                       image_url:
 *                         type: string
 *                         example: https://claripix-uploads.s3.ap-southeast-1.amazonaws.com/uploads/2025/11/03/abc.jpg
 *       500:
 *         description: Lỗi máy chủ
 */

router.get(
    "",
    validate(paginationValidation),
    imageController.getImagesWithPagination
)

const getImageByIdValidation = [
    param('imageId')
        .notEmpty()
        .withMessage('imageId is required')
        .isUUID()
        .withMessage('imageId must be a valid UUID'),
];

/**
 * @swagger
 * /images/{imageId}:
 *   get:
 *     summary: Lấy thông tin ảnh theo ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ảnh cần lấy thông tin
 *     responses:
 *       200:
 *         description: Thông tin ảnh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: a87f4e1a-d3b8-4f4f-9d62-5cbf78a7f9b9
 *                     uploader_id:
 *                       type: string
 *                       example: 71c9e45f-56ab-4f7b-93d7-fb19841e2b2b
 *                     image_url:
 *                       type: string
 *                       example: https://claripix-uploads.s3.ap-southeast-1.amazonaws.com/uploads/2025/11/03/abc.jpg
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

router.get(
    "/:imageId",
    validate(getImageByIdValidation),
    imageController.getImageById
);

module.exports = router;