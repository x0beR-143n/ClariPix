import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

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

export default LikeByUserModel;