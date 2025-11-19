// database/associations.js
import User from '../models/user.model.js';
import Image from '../models/image.model.js';
import Collection from '../models/collection.model.js';
import CollectionImage from '../models/collectionImage.model.js';
import LikeByUser from '../models/likeByUser.model.js';
import ImageViewByUser from '../models/imageViewByUser.model.js';

function setupAssociations() {
    try {
        console.log('🔗 Setting up database associations...');

        // User associations
        User.hasMany(Image, {
            foreignKey: 'uploader_id',
            as: 'uploaded_images'
        });
        User.hasMany(Collection, {
            foreignKey: 'user_id',
            as: 'collections'
        });
        User.hasMany(LikeByUser, {
            foreignKey: 'user_id'
        });
        User.hasMany(ImageViewByUser, {
            foreignKey: 'user_id'
        });

        // Image associations
        Image.belongsTo(User, {
            foreignKey: 'uploader_id',
            as: 'uploader'
        });
        Image.hasMany(CollectionImage, {
            foreignKey: 'image_id'
        });
        Image.belongsToMany(Collection, {
            through: CollectionImage,
            foreignKey: 'image_id',
            otherKey: 'collection_id',
            as: 'collections'
        });
        Image.hasMany(LikeByUser, {
            foreignKey: 'image_id'
        });
        Image.hasMany(ImageViewByUser, {
            foreignKey: 'image_id'
        });

        Collection.belongsTo(User, {
            foreignKey: 'user_id',
            as: 'owner'
        });
        Collection.hasMany(CollectionImage, {
            foreignKey: 'collection_id'
        });
        Collection.belongsToMany(Image, {
            through: CollectionImage,
            foreignKey: 'collection_id',
            otherKey: 'image_id',
            as: 'images'
        });

        CollectionImage.belongsTo(Collection, {
            foreignKey: 'collection_id'
        });
        CollectionImage.belongsTo(Image, {
            foreignKey: 'image_id'
        });

        LikeByUser.belongsTo(User, {
            foreignKey: 'user_id'
        });
        LikeByUser.belongsTo(Image, {
            foreignKey: 'image_id'
        });

        ImageViewByUser.belongsTo(User, {
            foreignKey: 'user_id'
        });
        ImageViewByUser.belongsTo(Image, {
            foreignKey: 'image_id'
        });

        console.log('✅ Database associations set up successfully');
    } catch (error) {
        console.error('❌ Error setting up associations:', error);
        throw error;
    }
}

export default setupAssociations;