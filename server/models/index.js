const { sequelize } = require('../database/db');
const User = require('./user.model');
const Image = require('./image.model');
const Collection = require('./collection.model');
const CollectionImage = require('./collectionImage.model');
const LikeByUser = require('./likeByUser.model');
const ImageViewByUser = require('./imageViewByUser.model');

// Associations
function setupAssociations() {
    console.log('🔗 Setting up associations...');

    User.hasMany(Image, { foreignKey: 'uploader_id', as: 'uploaded_images' });
    Image.belongsTo(User, { foreignKey: 'uploader_id', as: 'uploader' });

    User.hasMany(Collection, { foreignKey: 'user_id', as: 'collections' });
    Collection.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });

    Collection.belongsToMany(Image, {
        through: CollectionImage,
        foreignKey: 'collection_id',
        otherKey: 'image_id',
        as: 'images'
    });
    Image.belongsToMany(Collection, {
        through: CollectionImage,
        foreignKey: 'image_id',
        otherKey: 'collection_id',
        as: 'collections'
    });

    User.hasMany(LikeByUser, { foreignKey: 'user_id' });
    Image.hasMany(LikeByUser, { foreignKey: 'image_id' });
    LikeByUser.belongsTo(User, { foreignKey: 'user_id' });
    LikeByUser.belongsTo(Image, { foreignKey: 'image_id' });

    User.hasMany(ImageViewByUser, { foreignKey: 'user_id' });
    Image.hasMany(ImageViewByUser, { foreignKey: 'image_id' });
    ImageViewByUser.belongsTo(User, { foreignKey: 'user_id' });
    ImageViewByUser.belongsTo(Image, { foreignKey: 'image_id' });

    console.log('✅ Associations set up successfully');
}

setupAssociations();

module.exports = {
    sequelize,
    User,
    Image,
    Collection,
    CollectionImage,
    LikeByUser,
    ImageViewByUser
};
