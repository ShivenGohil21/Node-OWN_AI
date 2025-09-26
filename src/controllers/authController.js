const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/hash');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Registration
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array() 
    });
  }

  const { name, email, password, role = 'Staff', phone, city, country } = req.body;

  try {
    const userRepository = AppDataSource.getRepository('User');
    const existingUser = await userRepository.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(password);
    const user = userRepository.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role, 
      phone, 
      city, 
      country 
    });
    
    const savedUser = await userRepository.save(user);

    // Remove password from response
    const { password: _, ...userResponse } = savedUser;
    
    return res.status(201).json({ 
      message: 'User registered successfully', 
      user: userResponse 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array() 
    });
  }

  const { email, password } = req.body;

  try {
    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const { password: _, ...userResponse } = user;
    
    return res.json({ 
      message: 'Login successful',
      token, 
      user: userResponse 
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};
