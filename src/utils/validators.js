const { body } = require('express-validator');

const registerRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['Admin', 'Staff'])
    .withMessage('Role must be either Admin or Staff'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City name must not exceed 100 characters'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country name must not exceed 100 characters'),
];

const loginRules = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const updateUserRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City name must not exceed 100 characters'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country name must not exceed 100 characters'),
  
  body('role')
    .optional()
    .isIn(['Admin', 'Staff'])
    .withMessage('Role must be either Admin or Staff'),
];

const updatePasswordRules = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
];

module.exports = {
  registerRules,
  loginRules,
  updateUserRules,
  updatePasswordRules,
};
