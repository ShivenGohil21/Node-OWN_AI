const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { updateUserRules, updatePasswordRules } = require('../utils/validators');
const userController = require('../controllers/userController');

const router = express.Router();

// User routes
router.get('/', authMiddleware, adminOnly, userController.listUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, updateUserRules, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.patch('/:id/password', authMiddleware, updatePasswordRules, userController.updatePassword);

module.exports = router;
