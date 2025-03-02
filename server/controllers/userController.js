const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, address } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            phone,
            password,
            address
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { login, password } = req.body;

        // Find user by email or phone
        const user = await User.findOne({
            $or: [
                { email: login },
                { phone: login }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Register admin user
// @route   POST /api/users/admin
// @access  Public (you might want to protect this in production)
const registerAdmin = async (req, res) => {
    try {
        const { name, email, phone, password, address } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            phone,
            password,
            address,
            isAdmin: true  // This makes the user an admin
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (user) {
            if (user.isAdmin) {
                res.status(400).json({ message: 'Cannot delete admin user' });
                return;
            }
            await user.remove();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    registerAdmin,
    updateProfile,
    getUsers,
    deleteUser
}; 