import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

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
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
    tableName: 'collections',
    indexes: [
        { fields: ['user_id'] }
    ]
});

Collection.associate = function(models) {
    Collection.belongsTo(models.User, { foreignKey: 'user_id' });
    Collection.belongsToMany(models.Image, {
        through: models.CollectionImage,
        foreignKey: 'collection_id',
        otherKey: 'image_id',
        as: 'images'
    });
};

export default Collection;