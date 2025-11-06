const {DataTypes} = require('sequelize');
const {sequelize} = require('../database/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Tự động tạo UUID
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password_hash: { // FIELD FOR AUTHENTICATION
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    avatar_url: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    preferences: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        validate: {
            isValidCategories(value) {
                if (value) {
                    const invalidCategories = value.filter(cat => !AVAILABLE_CATEGORIES.includes(cat));
                    if (invalidCategories.length > 0) {
                        throw new Error(`Invalid categories: ${invalidCategories.join(', ')}`);
                    }
                }
            }
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false, // Tắt 'createdAt' và 'updatedAt' tự động của Sequelize
    tableName: 'users',
});

module.exports = User;