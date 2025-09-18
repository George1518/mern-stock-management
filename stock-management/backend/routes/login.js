const express = require("express");
const router = express.Router();
const User = require('../model/user');
const { body, validationResult } = require('express-validator');

// Login validation
const validateLogin = [
    body('email')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Login route
router.post("/", validateLogin, async (req, res) => {
    try {
        // Check validation results
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

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

      
                    // After password is validated
req.session.user = {
  id: user._id,
  name: user.name,
  role: user.role
};

        // Return success response
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.toJSON() // This will exclude the password
            }
        });





    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;