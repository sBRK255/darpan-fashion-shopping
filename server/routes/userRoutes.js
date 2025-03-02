const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    registerAdmin, 
    updateProfile,
    getUsers,
    deleteUser 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/admin', registerAdmin);

// Protected routes
router.put('/profile', protect, updateProfile);
router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

// Admin routes
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router; 