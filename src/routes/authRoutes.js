const express = require('express');
const { registerRules, loginRules } = require('../utils/validators');
const authController = require('../controllers/authController');

const router = express.Router();

// Authentication routes
router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);

module.exports = router;
