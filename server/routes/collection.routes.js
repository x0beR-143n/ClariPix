/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: User collection management APIs
 */

const express = require("express");
const collectionController = require("../controllers/collection.controller");
const { authenticate } = require("../middleware/authenticate");
const {
    validate,
    createCollectionValidation,
    collectionIdValidation,
    imageIdValidation, collectionImagesValidation,
    multipleImageIdValidation,
} = require("../middleware/validation.middleware");

const router = express.Router();

/**
 * @swagger
 * /collections:
 *   post:
 *     summary: Create a new collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Favorite Images"
 *               description:
 *                 type: string
 *                 example: "A collection of my favorite images"
 *     responses:
 *       201:
 *         description: Collection created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Collection created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "a87f4e1a-d3b8-4f4f-9d62-5cbf78a7f9b9"
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       example: "71c9e45f-56ab-4f7b-93d7-fb19841e2b2b"
 *                     name:
 *                       type: string
 *                       example: "My Favorite Images"
 *                     description:
 *                       type: string
 *                       example: "A collection of my favorite images"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00.000Z"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    authenticate,
    validate(createCollectionValidation),
    collectionController.createCollection
);

/**
 * @swagger
 * /collections/my-collections:
 *   get:
 *     summary: Get all collections of the current user
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Collections retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "a87f4e1a-d3b8-4f4f-9d62-5cbf78a7f9b9"
 *                       user_id:
 *                         type: string
 *                         format: uuid
 *                         example: "71c9e45f-56ab-4f7b-93d7-fb19841e2b2b"
 *                       name:
 *                         type: string
 *                         example: "My Favorite Images"
 *                       description:
 *                         type: string
 *                         example: "A collection of my favorite images"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00.000Z"
 *                       images:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Image'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
    "/my-collections",
    authenticate,
    collectionController.getUserCollections
);

/**
 * @swagger
 * /collections/{collectionId}/images:
 *   get:
 *     summary: Get all images in a specific collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the collection
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of images per page
 *     responses:
 *       200:
 *         description: Collection images retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     collection:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: "a87f4e1a-d3b8-4f4f-9d62-5cbf78a7f9b9"
 *                         name:
 *                           type: string
 *                           example: "My Favorite Images"
 *                         description:
 *                           type: string
 *                           example: "A collection of my favorite images"
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2023-01-01T00:00:00.000Z"
 *                     images:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Image'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 45
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/:collectionId/images",
    authenticate,
    validate(collectionImagesValidation),
    collectionController.getCollectionImages
);

/**
 * @swagger
 * /collections/create-default:
 *   post:
 *     summary: Create a default collection for user
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Default collection created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Default collection created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "a87f4e1a-d3b8-4f4f-9d62-5cbf78a7f9b9"
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       example: "71c9e45f-56ab-4f7b-93d7-fb19841e2b2b"
 *                     name:
 *                       type: string
 *                       example: "My Favorites"
 *                     description:
 *                       type: string
 *                       example: "My favorite images collection"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
    "/create-default",
    authenticate,
    collectionController.createDefaultCollection
);

/**
 * @swagger
 * /collections/{collectionId}/images:
 *   post:
 *     summary: Add one or multiple images to a collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the collection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageIds
 *             properties:
 *               imageIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["a87f4e1a-d3b8-4f4f-9d62-5cbf78a7f9b9", "b98g5f2b-e4c9-5g5g-0e73-6dcg89b8g0ca"]
 *     responses:
 *       200:
 *         description: Images added to collection successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Images added to collection successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     added:
 *                       type: array
 *                       items:
 *                         type: string
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Validation error or images already in collection
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Collection or images not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/:collectionId/images",
    authenticate,
    validate([...collectionIdValidation, ...multipleImageIdValidation]),
    collectionController.addImageToCollection
);

/**
 * @swagger
 * /collections/{collectionId}/images/{imageId}:
 *   delete:
 *     summary: Remove an image from a collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the collection
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the image to remove
 *     responses:
 *       200:
 *         description: Image removed from collection successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Image removed from collection successfully"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Collection or image not found
 *       500:
 *         description: Internal server error
 */
router.delete(
    "/:collectionId/images/:imageId",
    authenticate,
    validate(collectionIdValidation),
    collectionController.removeImageFromCollection
);

/**
 * @swagger
 * /collections/{collectionId}:
 *   delete:
 *     summary: Delete a collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the collection to delete
 *     responses:
 *       200:
 *         description: Collection deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Collection deleted successfully"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Internal server error
 */
router.delete(
    "/:collectionId",
    authenticate,
    validate(collectionIdValidation),
    collectionController.deleteCollection
);

module.exports = router;