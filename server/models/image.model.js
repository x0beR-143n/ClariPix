import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    uploader_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    safe_score: {
        type: DataTypes.REAL,
    },
    adult_level: {
        type: DataTypes.ENUM('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'),
    },
    violence_level: {
        type: DataTypes.ENUM('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'),
    },
    racy_level: {
        type: DataTypes.ENUM('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'),
    },
    categories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    total_views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    total_likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    safe_search_status: {
        type: DataTypes.ENUM('pending', 'processed', 'error'),
        defaultValue: 'pending',
    },
    categorization_status: {
        type: DataTypes.ENUM('pending', 'processed', 'error'),
        defaultValue: 'pending',
    }
}, {
    timestamps: false,
    tableName: 'images',
    indexes: [
        {fields: ['uploader_id']}
    ]
});

export default Image;