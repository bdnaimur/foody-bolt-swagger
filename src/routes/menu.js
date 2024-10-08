const express = require('express');
const { body } = require('express-validator');
const menuController = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/menus:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - restaurant
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               restaurant:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, authorize('restaurant_owner', 'restaurant_manager'), [
  body('name').notEmpty().withMessage('Item name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('restaurant').isMongoId().withMessage('Valid restaurant ID is required'),
  body('category').notEmpty().withMessage('Category is required')
], menuController.createMenuItem);

/**
 * @swagger
 * /api/menus/restaurant/{restaurantId}:
 *   get:
 *     summary: Get menu items for a specific restaurant
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu items retrieved successfully
 */
router.get('/restaurant/:restaurantId', menuController.getMenuByRestaurant);

/**
 * @swagger
 * /api/menus/popular:
 *   get:
 *     summary: Get popular menu items
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Popular menu items retrieved successfully
 */
router.get('/popular', menuController.getPopularItems);

/**
 * @swagger
 * /api/menus/{id}:
 *   get:
 *     summary: Get a specific menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item retrieved successfully
 *       404:
 *         description: Menu item not found
 */
router.get('/:id', menuController.getMenuItem);

/**
 * @swagger
 * /api/menus/{id}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Menu item not found
 */
router.put('/:id', protect, authorize('restaurant_owner', 'restaurant_manager'), menuController.updateMenuItem);

/**
 * @swagger
 * /api/menus/{id}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Menu item not found
 */
router.delete('/:id', protect, authorize('restaurant_owner', 'restaurant_manager'), menuController.deleteMenuItem);

module.exports = router;