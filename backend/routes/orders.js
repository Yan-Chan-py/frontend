/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Customer order management
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/ordersController');

const orderValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^\+?[\d\s\-().]{7,20}$/)
    .withMessage('Invalid phone number format'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 99 })
    .withMessage('Quantity must be between 1 and 99'),
];

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone]
 *             properties:
 *               name: { type: string, example: Ann }
 *               phone: { type: string, example: "+1 (555) 123-4567" }
 *               address: { type: string }
 *               message: { type: string }
 *               product: { type: string }
 *               quantity: { type: integer, default: 1 }
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', ...orderValidation, ctrl.create);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get('/', ctrl.getAll);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Updated order
 *       404:
 *         description: Not found
 */
router.patch('/:id/status', ctrl.updateStatus);

module.exports = router;
