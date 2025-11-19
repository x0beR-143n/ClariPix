/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management APIs
 */

import express from 'express';
import userController from '../controllers/user.controller.js';
import authenticate from '../middleware/authenticate.js';
import { validate, updateProfileValidation, preferencesValidation } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve authenticated user's profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "71c9e45f-56ab-4f7b-93d7-fb19841e2b2b"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "john@example.com"
 *                     gender:
 *                       type: string
 *                       enum: [male, female, other]
 *                       nullable: true
 *                       example: "male"
 *                     birthdate:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                       example: "1990-01-01"
 *                     avatar_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://example.com/avatar.jpg"
 *                     preferences:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["technology", "sports"]
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update authenticated user's profile information including preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe Updated"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               avatar_url:
 *                 type: string
 *                 example: "https://example.com/new-avatar.jpg"
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["technology", "science", "art"]
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: "Profile updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "71c9e45f-56ab-4f7b-93d7-fb19841e2b2b"
 *                     name:
 *                       type: string
 *                       example: "John Doe Updated"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     birthdate:
 *                       type: string
 *                       example: "1990-01-01"
 *                     avatar_url:
 *                       type: string
 *                       example: "https://example.com/new-avatar.jpg"
 *                     preferences:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["technology", "science", "art"]
 *       400:
 *         description: Invalid input data or validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/preferences:
 *   post:
 *     summary: Set user preferences
 *     description: Set or update authenticated user's preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - preferences
 *             properties:
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["technology", "science", "art"]
 *     responses:
 *       200:
 *         description: Preferences set successfully
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
 *                   example: "Preferences set successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "71c9e45f-56ab-4f7b-93d7-fb19841e2b2b"
 *                     preferences:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["technology", "science", "art"]
 *       400:
 *         description: Invalid categories or validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/categories:
 *   get:
 *     summary: Get all available categories for preferences
 *     description: Retrieve list of all available categories for user preferences
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
 *                     type: string
 *                   example: ["technology", "sports", "science", "art", "music", "travel", "food", "health", "business", "entertainment"]
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/my-images:
 *   get:
 *     summary: Get all images uploaded by the current user
 *     description: Retrieve paginated list of images uploaded by the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: User's uploaded images retrieved successfully
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
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: "a87f4e1a-d3b8-4f4f-9d62-5cbf78a7f9b9"
 *                           uploader_id:
 *                             type: string
 *                             format: uuid
 *                             example: "71c9e45f-56ab-4f7b-93d7-fb19841e2b2b"
 *                           image_url:
 *                             type: string
 *                             example: "https://example.com/image.jpg"
 *                           description:
 *                             type: string
 *                             example: "A beautiful landscape"
 *                           safe_score:
 *                             type: number
 *                             format: float
 *                             example: 0.95
 *                           adult_level:
 *                             type: string
 *                             enum: [UNKNOWN, VERY_UNLIKELY, UNLIKELY, POSSIBLE, LIKELY, VERY_LIKELY]
 *                             example: "VERY_UNLIKELY"
 *                           violence_level:
 *                             type: string
 *                             enum: [UNKNOWN, VERY_UNLIKELY, UNLIKELY, POSSIBLE, LIKELY, VERY_LIKELY]
 *                             example: "UNLIKELY"
 *                           racy_level:
 *                             type: string
 *                             enum: [UNKNOWN, VERY_UNLIKELY, UNLIKELY, POSSIBLE, LIKELY, VERY_LIKELY]
 *                             example: "UNLIKELY"
 *                           categories:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["landscape", "nature"]
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-01T00:00:00.000Z"
 *                           total_views:
 *                             type: integer
 *                             example: 150
 *                           total_likes:
 *                             type: integer
 *                             example: 25
 *                           safe_search_status:
 *                             type: string
 *                             enum: [pending, processed, error]
 *                             example: "processed"
 *                           categorization_status:
 *                             type: string
 *                             enum: [pending, processed, error]
 *                             example: "processed"
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
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile with uploaded images and collections
 *     description: Retrieve authenticated user's profile information including all uploaded images and collections (without pagination)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "71c9e45f-56ab-4f7b-93d7-fb19841e2b2b"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "john@example.com"
 *                     gender:
 *                       type: string
 *                       enum: [male, female, other]
 *                       nullable: true
 *                       example: "male"
 *                     birthdate:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                       example: "1990-01-01"
 *                     avatar_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://example.com/avatar.jpg"
 *                     preferences:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["technology", "sports"]
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00.000Z"
 *                     uploaded_images:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Image'
 *                     collections:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Collection'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

// Public routes
router.get('/categories', userController.getCategories);
// Protected routes
router.get('/profile', authenticate, userController.getUserProfile);
router.put('/profile', authenticate, validate(updateProfileValidation), userController.updateProfile);
router.post('/preferences', authenticate, validate(preferencesValidation), userController.setPreferences);
router.get('/my-images', authenticate, userController.getUserUploadedImages);
export default router;