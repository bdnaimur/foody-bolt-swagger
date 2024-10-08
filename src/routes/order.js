const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurant
 *               - items
 *               - deliveryAddress
 *             properties:
 *               restaurant:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuItem:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               deliveryAddress:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, authorize('customer'), [
  body('restaurant').isMongoId().withMessage('Valid restaurant ID is required'),
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.menuItem').isMongoId().withMessage('Valid menu item ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required')
], orderController.createOrder);

/**
 * @swagger
 * /api/orders/customer:
 *   get:
 *     summary: Get customer's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer's orders retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/customer', protect, authorize('customer'), orderController.getCustomerOrders);

/**
 * @swagger
 * /api/orders/restaurant:
 *   get:
 *     summary: Get restaurant's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Restaurant's orders retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/restaurant', protect, authorize('restaurant_owner', 'restaurant_manager'), orderController.getRestaurantOrders);

/**
 * @swagger
 * /api/orders/driver:
 *   get:
 *     summary: Get driver's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Driver's orders retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/driver', protect, authorize('delivery_driver'), orderController.getDriverOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a specific order
 *     tags: [Orders]
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
 *         description: Order retrieved successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Order not found
 */
router.get('/:id', protect, orderController.getOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [preparing, ready_for_pickup, out_for_delivery, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Order not found
 */
router.put('/:id/status', protect, authorize('restaurant_owner', 'restaurant_manager', 'delivery_driver'), orderController.updateOrderStatus);

module.exports = router;