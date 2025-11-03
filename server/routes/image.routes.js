/**
 * @swagger
 * tags:
 *   name: Images
 *   description: API cho quản lý ảnh người dùng (upload, xem, xóa, ...)
 */

const express = require("express");
const { body, validationResult } = require("express-validator");
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
    body("uploader_id").notEmpty().withMessage("uploader_id is required"),
    body("description").optional().isString(),
];

/**
 * @swagger
 * /images/upload:
 *   post:
 *     summary: Upload ảnh mới của người dùng
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - uploader_id
 *               - image
 *             properties:
 *               uploader_id:
 *                 type: string
 *                 example: 71c9e45f-56ab-4f7b-93d7-fb19841e2b2b
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
    imageController.uploadMiddleware, // parse multipart/form-data
    validate(uploadValidation),
    imageController.uploadImage
);

module.exports = router;