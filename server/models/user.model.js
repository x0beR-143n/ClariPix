import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import AVAILABLE_CATEGORIES from '../constants/categories.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Tự động tạo UUID
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password_hash: { // FIELD FOR AUTHENTICATION
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
    },
    birthdate: {
        type: DataTypes.DATEONLY,
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
                if (value && value.length > 0) {
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

export default User;