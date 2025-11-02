import {sequelize} from "../database/db";
import {Sequelize} from "sequelize";

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
    avatar_url: {
        type: DataTypes.TEXT,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
    },
}, {
    timestamps: false, // Tắt 'createdAt' và 'updatedAt' tự động của Sequelize
    tableName: 'users',
});

export {User};