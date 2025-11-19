import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const ImageViewByUser = sequelize.define('ImageViewByUser', {
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
    tableName: 'image_views_by_user',
    indexes: [
        { fields: ['image_id'] },
    ],
});

export default ImageViewByUser;