const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/authenticate');

// Public routes
router.get('/categories', userController.getCategories);

// Protected routes
router.get('/profile', authenticate, userController.getUserProfile);
router.put('/preferences', authenticate, userController.updatePreferences);

module.exports = router;