const userService = require('../services/user.service');

async function getUserProfile(req, res, next) {
    try {
        const user = await userService.getUserById(req.user.userId);
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

async function updateProfile(req, res, next) {
    try {
        const { name, gender, birthday, avatar_url, preferences } = req.body;
        const result = await userService.updateUserProfile(req.user.userId, {
            name,
            gender,
            birthday,
            avatar_url,
            preferences
        });

        res.json({
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
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUserProfile,
    updateProfile,
    getCategories
};