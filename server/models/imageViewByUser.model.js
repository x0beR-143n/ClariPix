const {DataTypes} = require('sequelize');
const {sequelize} = require('../database/db');

// A pair between user id and image id to track views
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
  });

module.exports = ImageViewByUser;