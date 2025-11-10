const {DataTypes} = require('sequelize');
const {sequelize} = require('../database/db');

const LikeByUserModel = sequelize.define('LikeByUser', {
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    image_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
}, {
    timestamps: false,
    tableName: 'image_likes_by_user',
    indexes: [
        { fields: ['image_id'] },
    ],
});

module.exports = LikeByUserModel;