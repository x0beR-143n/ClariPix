import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import AVAILABLE_CATEGORIES from '../constants/categories.js';
import Image from '../models/image.model.js';

async function register(userData) {
    const { name, email, password, gender, birthdate } = userData;

    try {
        console.log('🔍 Checking if user exists...');
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('❌ User already exists');
            const error = new Error('Email already exists');
            error.statusCode = 409;
            throw error;
        }

        console.log('🔐 Hashing password...');
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        console.log('👤 Creating user...');
        const user = await User.create({
            name,
            email,
            password_hash,
            gender: gender || null,
            birthdate: birthdate || null,
            preferences: []
        });

        console.log('🎫 Generating JWT token...');
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        console.log('✅ User registered successfully');
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                birthdate: user.birthdate,
                avatar_url: user.avatar_url,
                preferences: user.preferences,
                created_at: user.created_at
            },
            token
        };
    } catch (error) {
        console.error('❌ Error in register service:', error);
        throw error;
    }
}

async function login(loginData) {
    const { email, password } = loginData;

    try {
        console.log('🔍 Finding user for login...');
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('❌ User not found');
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        console.log('🔐 Comparing passwords...');
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            console.log('❌ Invalid password');
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        console.log('🎫 Generating JWT token for login...');
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        console.log('✅ User logged in successfully');
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                birthdate: user.birthdate,
                avatar_url: user.avatar_url,
                preferences: user.preferences,
                created_at: user.created_at
            },
            token
        };
    } catch (error) {
        console.error('❌ Error in login service:', error);
        throw error;
    }
}

async function setUserPreferences(userId, preferences) {
    try {
        console.log('🔍 Validating preferences...');
        if (preferences && preferences.length > 0) {
            const invalidCategories = preferences.filter(cat => !AVAILABLE_CATEGORIES.includes(cat));
            if (invalidCategories.length > 0) {
                console.log('❌ Invalid categories found:', invalidCategories);
                const error = new Error(`Invalid categories: ${invalidCategories.join(', ')}`);
                error.statusCode = 400;
                throw error;
            }
        }

        const user = await User.findByPk(userId);
        if (!user) {
            console.log('❌ User not found for setting preferences');
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        user.preferences = preferences || [];
        await user.save();

        return {
            id: user.id,
            preferences: user.preferences,
        };
    } catch (error) {
        console.error('❌ Error in setUserPreferences service:', error);
        throw error;
    }
}

async function getUserById(userId) {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return user;
}

async function updateUserProfile(userId, profileData) {
    try {
        const { name, gender, birthdate, avatar_url, preferences } = profileData;

        // Validate preferences if provided
        if (preferences && preferences.length > 0) {
            const invalidCategories = preferences.filter(cat => !AVAILABLE_CATEGORIES.includes(cat));
            if (invalidCategories.length > 0) {
                const error = new Error(`Invalid categories: ${invalidCategories.join(', ')}`);
                error.statusCode = 400;
                throw error;
            }
        }

        const user = await User.findByPk(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Update allowed fields
        const allowedUpdates = {};
        if (name !== undefined) allowedUpdates.name = name;
        if (gender !== undefined) allowedUpdates.gender = gender;
        if (birthdate !== undefined) allowedUpdates.birthdate = birthdate;
        if (avatar_url !== undefined) allowedUpdates.avatar_url = avatar_url;
        if (preferences !== undefined) allowedUpdates.preferences = preferences;

        await user.update(allowedUpdates);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            birthdate: user.birthdate,
            avatar_url: user.avatar_url,
            preferences: user.preferences,
            updated_at: new Date()
        };
    } catch (error) {
        console.error('❌ Error in updateUserProfile service:', error);
        throw error;
    }
}

async function getUserUploadedImagesWithoutPagination(userId) {
    try {
        const images = await Image.findAll({
            where: { uploader_id: userId },
            order: [['created_at', 'DESC']],
            include: [{
                model: User,
                as: 'uploader',
                attributes: ['id', 'name', 'avatar_url']
            }]
        });

        return {
            images,
            pagination: {
                page: 1,
                limit: images.length,
                total: images.length,
                totalPages: 1
            }
        };
    } catch (error) {
        console.error('Error getting user uploaded images without pagination:', error);
        throw error;
    }
}

async function getAvailableCategories() {
    return AVAILABLE_CATEGORIES;
}

async function getUserUploadedImages(userId, page = 1, limit = 10) {
    try {
        const offset = (page - 1) * limit;

        const images = await Image.findAll({
            where: { uploader_id: userId },
            limit,
            offset,
            order: [['created_at', 'DESC']],
            include: [{
                model: User,
                as: 'uploader',
                attributes: ['id', 'name', 'avatar_url']
            }]
        });

        const total = await Image.count({
            where: { uploader_id: userId }
        });

        return {
            images,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error('Error getting user uploaded images:', error);
        throw error;
    }
}

export default {
    register,
    login,
    setUserPreferences,
    getUserById,
    updateUserProfile,
    getAvailableCategories,
    getUserUploadedImages
};