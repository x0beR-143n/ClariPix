/**
 * @swagger
 * tags:
 *   name: Images
 *   description: API cho quản lý ảnh người dùng (upload, xem, xóa, ...)
 */

import express from "express";
import imageController from "../controllers/image.controller.js";
import authenticate from "../middleware/authenticate.js";
import { validate, imageIdParamValidation, paginationValidation } from "../middleware/validation.middleware.js";

const router = express.Router();

// /**
//  * @swagger
//  * /images/upload:
//  *   post:
//  *     summary: Upload ảnh mới của người dùng
//  *     tags: [Images]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - image
//  *             properties:
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       201:
//  *         description: Upload thành công
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                   example: success
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                       example: a87f4e1a-d3b8-4f4f-9d62-5cbf78a7f9b9
//  *                     created_at:
//  *                       type: string
//  *                       example: 2025-11-03T10:15:30.000Z
//  *                     total_views:
//  *                       type: integer
//  *                       example: 0
//  *                     total_likes:
//  *                       type: integer
//  *                       example: 0
//  *                     status:
//  *                       type: string
//  *                       example: pending
//  *                     uploader_id:
//  *                       type: string
//  *                       example: 71c9e45f-56ab-4f7b-93d7-fb19841e2b2b
//  *                     image_url:
//  *                       type: string
//  *                       example: https://claripix-uploads.s3.ap-southeast-1.amazonaws.com/uploads/2025/11/03/abc.jpg
//  *                     description:
//  *                       type: string
//  *                       example: ""
//  *       400:
//  *         description: Thiếu file hoặc dữ liệu không hợp lệ
//  */
//
// router.post(
//     "/upload",
//     authenticate,
//     imageController.uploadMiddleware,
//     imageController.uploadImage
// );

/**
 * @swagger
 * /images/uploads:
 *   post:
 *     summary: Upload một hoặc nhiều ảnh trong một request
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
 *               - images
 *             properties:
 *               descriptions:
 *                 type: string
 *                 description: |
 *                   Có thể là:
 *                   - JSON array: ["Mô tả 1", "Mô tả 2"]
 *                   - String thông thường: "mô tả 1, mô tả 2" (sẽ được tách bằng dấu phẩy)
 *                 example: 'trekka, anh 2 ne'
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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
 *                 message:
 *                   type: string
 *                   example: Successfully uploaded 2 image(s)
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
 *                       description:
 *                         type: string
 *                         example: "trekka"
 *       400:
 *         description: Thiếu file hoặc dữ liệu không hợp lệ
 */

router.post(
    "/uploads",
    authenticate,
    imageController.uploadMultipleMiddleware,
    imageController.uploadImage
);

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
    validate(imageIdParamValidation),
    imageController.deleteImage
);


// /**
//  * @swagger
//  * /images/{imageId}/view:
//  *   post:
//  *     summary: Tăng số lượt xem của ảnh
//  *     tags: [Images]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: imageId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID của ảnh
//  *     responses:
//  *       200:
//  *         description: Lượt xem của ảnh đã được tăng
//  *       400:
//  *         description: Dữ liệu không hợp lệ
//  */
//
// router.post(
//     "/:imageId/view",
//     authenticate,
//     imageController.incrementViewCount
// )

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
 *       - in: query
 *         name: queries
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: |
 *           Mảng chuỗi truy vấn. Hỗ trợ nhiều cách truyền: `queries[]=a&queries[]=b`, `queries=a,b` hoặc `queries=["a","b"]`.
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
    validate(imageIdParamValidation),
    imageController.getImageById
);

export default router;