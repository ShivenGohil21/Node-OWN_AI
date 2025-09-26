const AppDataSource = require('../config/database');

// List Users (Admin only)
exports.listUsers = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository('User');
    const { q, country, page = 1, limit = 50 } = req.query;

    const queryBuilder = userRepository.createQueryBuilder('user');
    
    // Search by name and email
    if (q) {
      queryBuilder.andWhere('(user.name LIKE :q OR user.email LIKE :q)', { 
        q: `%${q}%` 
      });
    }
    
    // Filter by country
    if (country) {
      queryBuilder.andWhere('user.country = :country', { country });
    }

    // Pagination
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    queryBuilder.skip((pageNumber - 1) * limitNumber).take(limitNumber);

    const [users, total] = await queryBuilder.getManyAndCount();

    // Remove passwords from response
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return res.json({ 
      message: 'Users retrieved successfully',
      total, 
      page: pageNumber, 
      limit: limitNumber, 
      users: sanitizedUsers 
    });
  } catch (error) {
    console.error('List users error:', error);
    return res.status(500).json({ message: 'Server error while retrieving users' });
  }
};

// User Details
exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (req.user.role !== 'Admin' && req.user.id !== userId) {
      return res.status(403).json({ 
        message: 'Forbidden: You can only view your own details' 
      });
    }

    // Remove password from response
    const { password, ...userResponse } = user;
    
    return res.json({ 
      message: 'User details retrieved successfully',
      user: userResponse 
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({ message: 'Server error while retrieving user details' });
  }
};

// UPDATE User
exports.updateUser = async (req, res) => {
  try {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions - Admin can update any user, users can update themselves
    if (req.user.role !== 'Admin' && req.user.id !== userId) {
      return res.status(403).json({ 
        message: 'Forbidden: You can only update your own profile' 
      });
    }

    // Extract updatable fields
    const { name, phone, city, country, role } = req.body;
    const updateData = {};

    // Only update provided fields
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    
    // Only admins can update role
    if (role !== undefined && req.user.role === 'Admin') {
      updateData.role = role;
    }

    // Update timestamp
    updateData.updatedAt = new Date();

    // Perform update
    await userRepository.update(userId, updateData);
    
    // Fetch updated user
    const updatedUser = await userRepository.findOne({ where: { id: userId } });
    
    // Remove password from response
    const { password, ...userResponse } = updatedUser;
    
    return res.json({ 
      message: 'User updated successfully',
      user: userResponse 
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ message: 'Server error while updating user' });
  }
};

// DELETE User (Soft Delete)
exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions - Only Admin can delete users
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ 
        message: 'Forbidden: Only administrators can delete users' 
      });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === userId) {
      return res.status(400).json({ 
        message: 'Cannot delete your own account' 
      });
    }

    // Hard delete (you can implement soft delete if needed)
    await userRepository.delete(userId);
    
    return res.json({ 
      message: 'User deleted successfully',
      deletedUserId: userId 
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Server error while deleting user' });
  }
};

// Update Password (separate endpoint for security)
exports.updatePassword = async (req, res) => {
  try {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }

    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions - users can only update their own password
    if (req.user.id !== userId) {
      return res.status(403).json({ 
        message: 'Forbidden: You can only update your own password' 
      });
    }

    // Verify current password
    const { comparePassword, hashPassword } = require('../utils/hash');
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);
    
    // Update password
    await userRepository.update(userId, { 
      password: hashedNewPassword,
      updatedAt: new Date()
    });
    
    return res.json({ 
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    return res.status(500).json({ message: 'Server error while updating password' });
  }
};
