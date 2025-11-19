import { body, param, query, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

// Validation middleware
export const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) return next();

        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    };
};

// Validation rules
export const registerValidation = [
    body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
    body('birthdate').optional().isDate().withMessage('Birthdate must be a valid date (YYYY-MM-DD)'),
];

export const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

export const updateProfileValidation = [
    body('name').optional().trim().isLength({ min: 1 }).withMessage('Name cannot be empty'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
    body('birthdate').optional().isDate().withMessage('Birthdate must be a valid date (YYYY-MM-DD)'),
    body('avatar_url').optional().isURL().withMessage('Avatar URL must be a valid URL'),
    body('preferences').optional().isArray().withMessage('Preferences must be an array'),
    body('preferences.*').optional().isString().withMessage('Each preference must be a string')
];

export const preferencesValidation = [
    body('preferences').isArray().withMessage('Preferences must be an array'),
    body('preferences.*').isString().withMessage('Each preference must be a string')
];

export const createCollectionValidation = [
    body("name").notEmpty().withMessage("Collection name is required"),
    body("description").optional().isString(),
];

export const collectionIdValidation = [
    param("collectionId").isUUID().withMessage("Invalid collection ID"),
];

export const collectionImagesValidation = [
    ...collectionIdValidation,
    query('page').optional().isInt({ min: 1 }).withMessage('page must be an integer greater than 0'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be an integer between 1 and 100')
];

export const multipleImageIdValidation = [
    body("imageIds")
        .isArray({ min: 1 })
        .withMessage("imageIds must be an array with at least one image ID"),
    body("imageIds.*")
        .isUUID()
        .withMessage("Each image ID must be a valid UUID")
];

export const imageIdValidation = [
    body("imageId")
        .optional()
        .isUUID()
        .withMessage("Invalid image ID"),
    body("imageIds")
        .optional()
        .isArray({ min: 1 })
        .withMessage("imageIds must be an array with at least one image ID"),
    body("imageIds.*")
        .optional()
        .isUUID()
        .withMessage("Each image ID must be a valid UUID")
];

export const imageIdOrImageIdsValidation = [
    body().custom((value, { req }) => {
        if (!req.body.imageId && !req.body.imageIds) {
            throw new Error('Either imageId or imageIds must be provided');
        }
        return true;
    })
];

export const imageIdParamValidation = [
    param('imageId')
        .notEmpty()
        .withMessage('imageId is required')
        .isUUID()
        .withMessage('imageId must be a valid UUID'),
];

export const paginationValidation = [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be an integer greater than 0'),
    query('limit').optional().isInt({ min: 1 }).withMessage('limit must be an integer greater than 0'),
    query('sorter').optional().isString().withMessage('sorter must be a string'),
    query('order').optional().isIn(['ASC', 'DESC']).withMessage('order must be either ASC or DESC'),
    query('queries')
        .optional()
        .customSanitizer((value) => {
            if (Array.isArray(value)) return value.map(String);
            if (typeof value === 'string') {
                const raw = value.trim();
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) return parsed.map(String);
                } catch (e) {}
                if (raw === '') return [];
                return raw.split(',').map(s => s.trim()).filter(Boolean);
            }
            if (value == null) return [];
            return [String(value)];
        })
        .isArray().withMessage('queries must be an array of strings'),
    query('queries.*').optional().isString().withMessage('each query must be a string')
];