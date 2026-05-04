/**
 * @swagger
 * tags:
 *   name: Bouquets
 *   description: Flower bouquet management
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/bouquetsController');

const bouquetValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
];

/**
 * @swagger
 * /api/bouquets:
 *   get:
 *     summary: Get all bouquets (with pagination & filters)
 *     tags: [Bouquets]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 15 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: bestseller
 *         schema: { type: boolean }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: List of bouquets with pagination info
 */
router.get('/', ctrl.getAll);

/**
 * @swagger
 * /api/bouquets/{id}:
 *   get:
 *     summary: Get single bouquet by ID
 *     tags: [Bouquets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Bouquet object
 *       404:
 *         description: Not found
 */
router.get('/:id', ctrl.getById);

/**
 * @swagger
 * /api/bouquets:
 *   post:
 *     summary: Create a new bouquet
 *     tags: [Bouquets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               image_url: { type: string }
 *               category: { type: string }
 *               is_bestseller: { type: boolean }
 *     responses:
 *       201:
 *         description: Created bouquet
 */
router.post('/', ...bouquetValidation, ctrl.create);

/**
 * @swagger
 * /api/bouquets/{id}:
 *   put:
 *     summary: Update a bouquet
 *     tags: [Bouquets]
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
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               image_url: { type: string }
 *               category: { type: string }
 *               is_bestseller: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated bouquet
 *       404:
 *         description: Not found
 */
router.put('/:id', ...bouquetValidation, ctrl.update);

/**
 * @swagger
 * /api/bouquets/{id}:
 *   delete:
 *     summary: Delete a bouquet
 *     tags: [Bouquets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', ctrl.remove);

module.exports = router;
