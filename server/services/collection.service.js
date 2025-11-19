import Collection from "../models/collection.model.js";
import CollectionImage from "../models/collectionImage.model.js";
import Image from "../models/image.model.js";

async function createCollection(userId, collectionData) {
    try {
        const { name, description } = collectionData;

        const collection = await Collection.create({
            user_id: userId,
            name,
            description
        });

        return collection;
    } catch (error) {
        console.error('Error creating collection:', error);
        throw error;
    }
}

async function getUserCollections(userId) {
    try {
        const collections = await Collection.findAll({
            where: { user_id: userId },
            include: [{
                model: Image,
                as: 'images',
                through: {
                    model: CollectionImage,
                    attributes: []
                },
                attributes: [
                    'id', 'uploader_id', 'image_url', 'description',
                    'safe_score', 'adult_level', 'violence_level', 'racy_level',
                    'categories', 'created_at', 'total_views', 'total_likes',
                    'safe_search_status', 'categorization_status'
                ]
            }],
            order: [['created_at', 'DESC']]
        });

        return collections;
    } catch (error) {
        console.error('Error getting user collections:', error);
        throw error;
    }
}

async function getCollectionImages(userId, collectionId, page = 1, limit = 10) {
    try {
        // Kiểm tra collection thuộc về user
        const collection = await Collection.findOne({
            where: {
                id: collectionId,
                user_id: userId
            }
        });

        if (!collection) {
            throw new Error('Collection not found or access denied');
        }

        const offset = (page - 1) * limit;

        // Lấy danh sách ảnh trong collection với phân trang
        const { count, rows: images } = await Image.findAndCountAll({
            include: [{
                model: Collection,
                as: 'collections',
                where: { id: collectionId },
                through: {
                    attributes: [] // Ẩn thông tin bảng trung gian
                },
                attributes: [] // Ẩn thông tin collection
            }],
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        return {
            collection: {
                id: collection.id,
                name: collection.name,
                description: collection.description,
                created_at: collection.created_at
            },
            images,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        };
    } catch (error) {
        console.error('Error getting collection images:', error);
        throw error;
    }
}

async function addImageToCollection(userId, collectionId, imageIds) {
    try {
        // Kiểm tra collection thuộc về user
        const collection = await Collection.findOne({
            where: {
                id: collectionId,
                user_id: userId
            }
        });

        if (!collection) {
            throw new Error('Collection not found or access denied');
        }

        // Ensure imageIds is an array
        const imageIdArray = Array.isArray(imageIds) ? imageIds : [imageIds];

        const results = [];
        const errors = [];

        for (const imageId of imageIdArray) {
            try {
                // Kiểm tra image tồn tại
                const image = await Image.findByPk(imageId);
                if (!image) {
                    errors.push(`Image not found: ${imageId}`);
                    continue;
                }

                // Kiểm tra image đã có trong collection chưa
                const existing = await CollectionImage.findOne({
                    where: {
                        collection_id: collectionId,
                        image_id: imageId
                    }
                });

                if (existing) {
                    errors.push(`Image already in collection: ${imageId}`);
                    continue;
                }

                // Thêm image vào collection
                await CollectionImage.create({
                    collection_id: collectionId,
                    image_id: imageId
                });

                results.push(imageId);
            } catch (error) {
                errors.push(`Error adding image ${imageId}: ${error.message}`);
            }
        }

        return {
            message: `Added ${results.length} image(s) to collection successfully`,
            added: results,
            errors: errors.length > 0 ? errors : undefined
        };
    } catch (error) {
        console.error('Error adding image to collection:', error);
        throw error;
    }
}


async function removeImageFromCollection(userId, collectionId, imageId) {
    try {
        // Kiểm tra collection thuộc về user
        const collection = await Collection.findOne({
            where: {
                id: collectionId,
                user_id: userId
            }
        });

        if (!collection) {
            throw new Error('Collection not found or access denied');
        }

        // Xóa image khỏi collection
        const result = await CollectionImage.destroy({
            where: {
                collection_id: collectionId,
                image_id: imageId
            }
        });

        if (result === 0) {
            throw new Error('Image not found in collection');
        }

        return { message: 'Image removed from collection successfully' };
    } catch (error) {
        console.error('Error removing image from collection:', error);
        throw error;
    }
}

async function deleteCollection(userId, collectionId) {
    try {
        const collection = await Collection.findOne({
            where: {
                id: collectionId,
                user_id: userId
            }
        });

        if (!collection) {
            throw new Error('Collection not found or access denied');
        }

        // Xóa tất cả image relationships trước
        await CollectionImage.destroy({
            where: { collection_id: collectionId }
        });

        // Xóa collection
        await collection.destroy();

        return { message: 'Collection deleted successfully' };
    } catch (error) {
        console.error('Error deleting collection:', error);
        throw error;
    }
}

// Thêm hàm để tạo collection mẫu nếu chưa có
async function createDefaultCollection(userId) {
    try {
        const existingCollection = await Collection.findOne({
            where: {
                user_id: userId,
                name: 'My Favorites'
            }
        });

        if (!existingCollection) {
            return await Collection.create({
                user_id: userId,
                name: 'My Favorites',
                description: 'My favorite images collection'
            });
        }
        return existingCollection;
    } catch (error) {
        console.error('Error creating default collection:', error);
        throw error;
    }
}

export default {
    createCollection,
    getUserCollections,
    getCollectionImages,
    addImageToCollection,
    removeImageFromCollection,
    deleteCollection,
    createDefaultCollection
};