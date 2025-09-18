const express = require("express");
const router = express.Router();
const User = require('../model/user');
const { validateUserRegistration, handleValidationErrors } = require('../middleware/validation');

router.post("/", validateUserRegistration, handleValidationErrors, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            role
        });

        // Save user to database
        const savedUser = await user.save();

// Add user to session
req.session.user = {
  id: savedUser._id,
  name: savedUser.name,
  role: savedUser.role
};


        // Return success response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: savedUser.toJSON() // This will exclude the password
            }

            
        });






    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate email error (unique constraint)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        
        // Handle validation errors from mongoose
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }
        
        // Handle other errors
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


module.exports = router;