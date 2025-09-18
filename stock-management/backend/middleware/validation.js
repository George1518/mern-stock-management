const { body, validationResult } = require('express-validator');

// Validation rules for user registration
const validateUserRegistration = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
        .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters')
        .trim()
        .escape(),
    
    body('email')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    
    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Role must be either "user" or "admin"')
];

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.param,
                message: error.msg
            }))
        });
    }
    
    next();
};

module.exports = {
    validateUserRegistration,
    handleValidationErrors
};