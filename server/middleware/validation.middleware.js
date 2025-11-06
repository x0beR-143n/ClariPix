const { body, validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

// Validation middleware
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    };
};

// Validation rules
const registerValidation = [
    body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
    body('birthday').optional().isDate().withMessage('Birthday must be a valid date (YYYY-MM-DD)'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

const updateProfileValidation = [
    body('name').optional().trim().isLength({ min: 1 }).withMessage('Name cannot be empty'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
    body('birthday').optional().isDate().withMessage('Birthday must be a valid date (YYYY-MM-DD)'),
    body('avatar_url').optional().isURL().withMessage('Avatar URL must be a valid URL'),
    body('preferences').optional().isArray().withMessage('Preferences must be an array'),
    body('preferences.*').optional().isString().withMessage('Each preference must be a string')
];

module.exports = {
    validate,
    registerValidation,
    loginValidation,
    updateProfileValidation
};