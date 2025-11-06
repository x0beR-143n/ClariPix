/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management APIs
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/authenticate');
const { validate, updateProfileValidation } = require('../middleware/validation.middleware');

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
 *                     birthday:
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
 *               birthday:
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
 *                 example: ["technology", "science", "arts"]
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
 *                     birthday:
 *                       type: string
 *                       example: "1990-01-01"
 *                     avatar_url:
 *                       type: string
 *                       example: "https://example.com/new-avatar.jpg"
 *                     preferences:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["technology", "science", "arts"]
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
 * /users/categories:
 *   get:
 *     summary: Get available categories for preferences
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
 *                   example: ["technology", "sports", "science", "arts", "music", "travel", "food", "health", "business", "entertainment"]
 *       500:
 *         description: Internal server error
 */

// Public routes
router.get('/categories', userController.getCategories);
// Protected routes
router.get('/profile', authenticate, userController.getUserProfile);
router.put('/profile', authenticate, validate(updateProfileValidation), userController.updateProfile);

module.exports = router;