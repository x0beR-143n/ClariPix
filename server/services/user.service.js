const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { AVAILABLE_CATEGORIES } = require('../constants/categories');

async function register(userData) {
    const { name, email, password, gender, birthday, preferences } = userData;

    try {
        console.log('🔍 Checking if user exists...');
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('❌ User already exists');
            const error = new Error('Email already exists');
            error.statusCode = 409;
            throw error;
        }

        console.log('🔐 Hashing password...');
        // Hash password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        console.log('👤 Creating user...');
        // Create user
        const user = await User.create({
            name,
            email,
            password_hash,
            gender: gender || null,
            birthday: birthday || null,
            preferences: preferences || []
        });

        console.log('🎫 Generating JWT token...');
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        console.log('✅ User registered successfully');
        // Return user data without password
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                birthday: user.birthday,
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
        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('❌ User not found');
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        console.log('🔐 Comparing passwords...');
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            console.log('❌ Invalid password');
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        console.log('🎫 Generating JWT token for login...');
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        console.log('✅ User logged in successfully');
        // Return user data without password
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                birthday: user.birthday,
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

async function updateUserPreferences(userId, preferences) {
    try {
        // Validate preferences
        if (preferences) {
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

        user.preferences = preferences || [];
        await user.save();

        return {
            id: user.id,
            preferences: user.preferences
        };
    } catch (error) {
        console.error('❌ Error in updateUserPreferences service:', error);
        throw error;
    }
}

async function getAvailableCategories() {
    return AVAILABLE_CATEGORIES;
}

module.exports = {
    register,
    login,
    getUserById
};