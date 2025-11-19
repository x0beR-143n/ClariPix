import { StatusCodes } from 'http-status-codes';
import collectionService from '../services/collection.service.js';

async function createCollection(req, res, next) {
    try {
        const { name, description } = req.body;
        const userId = req.user.userId;

        const collection = await collectionService.createCollection(userId, {
            name,
            description
        });

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Collection created successfully',
            data: collection
        });
    } catch (error) {
        next(error);
    }
}

async function getUserCollections(req, res, next) {
    try {
        const userId = req.user.userId;
        const collections = await collectionService.getUserCollections(userId);

        res.status(StatusCodes.OK).json({
            success: true,
            data: collections
        });
    } catch (error) {
        next(error);
    }
}

async function getCollectionImages(req, res, next) {
    try {
        const { collectionId } = req.params;
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await collectionService.getCollectionImages(userId, collectionId, page, limit);

        res.status(StatusCodes.OK).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

async function addImageToCollection(req, res, next) {
    try {
        const { collectionId } = req.params;
        const { imageIds } = req.body;
        const userId = req.user.userId;

        if (!imageIds || (Array.isArray(imageIds) && imageIds.length === 0)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'No image IDs provided'
            });
        }

        const result = await collectionService.addImageToCollection(userId, collectionId, imageIds);

        res.status(StatusCodes.OK).json({
            success: true,
            message: result.message,
            data: {
                added: result.added,
                errors: result.errors
            }
        });
    } catch (error) {
        next(error);
    }
}

async function removeImageFromCollection(req, res, next) {
    try {
        const { collectionId, imageId } = req.params;
        const userId = req.user.userId;

        const result = await collectionService.removeImageFromCollection(userId, collectionId, imageId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
}

async function deleteCollection(req, res, next) {
    try {
        const { collectionId } = req.params;
        const userId = req.user.userId;

        const result = await collectionService.deleteCollection(userId, collectionId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
}

async function createDefaultCollection(req, res, next) {
    try {
        const userId = req.user.userId;
        const collection = await collectionService.createDefaultCollection(userId);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Default collection created successfully',
            data: collection
        });
    } catch (error) {
        next(error);
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