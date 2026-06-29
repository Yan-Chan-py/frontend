/**
 * @swagger
 * tags:
 *   name: Bouquets
 *   description: Flower bouquet management
 */
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bouquetsController');
const validateBody = require('../middlewares/validateBody');
const upload = require('../middlewares/upload');
const {
  createBouquetSchema,
  updateBouquetSchema,
  updateFavoriteSchema,
} = require('../schemas/bouquetSchemas');

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
 *             required: [title, description, price]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               photoURL: { type: string }
 *               category: { type: string }
 *               is_bestseller: { type: boolean }
 *               favorite: { type: boolean }
 *     responses:
 *       201:
 *         description: Created bouquet
 *       400:
 *         description: Validation error
 */
router.post('/', validateBody(createBouquetSchema), ctrl.create);

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
 *               title: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               photoURL: { type: string }
 *               category: { type: string }
 *               is_bestseller: { type: boolean }
 *               favorite: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated bouquet
 *       400:
 *         description: Validation error / Empty body
 *       404:
 *         description: Not found
 */
router.put('/:id', validateBody(updateBouquetSchema), ctrl.update);

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

/**
 * @swagger
 * /api/bouquets/{id}/favorite:
 *   patch:
 *     summary: Update bouquet favorite status
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
 *             required: [favorite]
 *             properties:
 *               favorite: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated bouquet
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */
router.patch('/:id/favorite', validateBody(updateFavoriteSchema), ctrl.updateFavorite);

/**
 * @swagger
 * /api/bouquets/{id}/photo:
 *   patch:
 *     summary: Upload and update bouquet image
 *     tags: [Bouquets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated bouquet with new photoURL
 *       400:
 *         description: Missing file or invalid type
 *       404:
 *         description: Not found
 */
router.patch('/:id/photo', upload.single('photo'), ctrl.updatePhoto);

module.exports = router;
