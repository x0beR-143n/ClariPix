const userService = require('../services/user.service');
const collectionService = require('../services/collection.service');
const {StatusCodes} = require("http-status-codes");

async function setPreferences(req, res, next) {
    try {
        const {preferences} = req.body;
        const result = await userService.setUserPreferences(req.user.userId, preferences);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Preferences updated successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
}

async function getUserProfile(req, res, next) {
    try {
        const user = await userService.getUserById(req.user.userId);

        // Lấy danh sách ảnh gần đây (không phân trang)
        const imagesResult = await userService.getUserUploadedImages(req.user.userId, 1, 1000);

        // Lấy danh sách collections (không phân trang)
        const collections = await collectionService.getUserCollections(req.user.userId);

        res.status(StatusCodes.OK).json({
            success: true,
            data: {
                ...user.toJSON(),
                recent_images: imagesResult.images,
                collections: collections
            }
        });
    } catch (error) {
        next(error);
    }
}

async function updateProfile(req, res, next) {
    try {
        const { name, gender, birthdate, avatar_url, preferences } = req.body;
        const result = await userService.updateUserProfile(req.user.userId, {
            name,
            gender,
            birthdate,
            avatar_url,
            preferences
        });

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Profile updated successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
}

async function getCategories(req, res, next) {
    try {
        const categories = await userService.getAvailableCategories();
        res.status(StatusCodes.OK).json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
}

async function getUserUploadedImages(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await userService.getUserUploadedImages(req.user.userId, page, limit);

        res.status(StatusCodes.OK).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    setPreferences,
    getUserProfile,
    updateProfile,
    getCategories,
    getUserUploadedImages
};