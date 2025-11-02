import {sequelize} from "../database/db";
import {Sequelize} from "sequelize";

const {DataTypes} = require('sequelize');
const {sequelize} = require('../database/db');

const Collection = sequelize.define('Collection', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
    },
}, {
    timestamps: false,
    tableName: 'collections',
    indexes: [
        { fields: ['user_id'] }
    ]
});

exports.Collection = Collection;