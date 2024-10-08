const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/profile', protect, userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 */
router.put('/profile', protect, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty')
], userController.updateProfile);

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: Get user's favorite menu items
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorites retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/favorites', protect, authorize('customer'), userController.getFavorites);

/**
 * @swagger
 * /api/users/favorites/{menuItemId}:
 *   post:
 *     summary: Add a menu item to favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuItemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item added to favorites
 *       401:
 *         description: Not authorized
 */
router.post('/favorites/:menuItemId', protect, authorize('customer'), userController.addFavorite);

/**
 * @swagger
 * /api/users/favorites/{menuItemId}:
 *   delete:
 *     summary: Remove a menu item from favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuItemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item removed from favorites
 *       401:
 *         description: Not authorized
 */
router.delete('/favorites/:menuItemId', protect, authorize('customer'), userController.removeFavorite);

module.exports = router;