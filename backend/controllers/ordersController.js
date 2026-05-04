const pool = require('../db/db');
const { validationResult } = require('express-validator');

/**
 * POST /api/orders  — place a new order
 */
const create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, phone, address, message, product, quantity } = req.body;
    const qty = Math.min(99, Math.max(1, parseInt(quantity, 10) || 1));

    const { rows } = await pool.query(
      `INSERT INTO orders (name, phone, address, message, product, quantity)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, phone, address || null, message || null, product || null, qty]
    );

    res.status(201).json({
      message: 'Order placed successfully',
      order: rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders  — list all orders (admin)
 */
const getAll = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const countRes = await pool.query('SELECT COUNT(*) FROM orders');
    const total = parseInt(countRes.rows[0].count);

    const { rows } = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      data: rows,
      total,
      page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/orders/:id/status  — update order status
 */
const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['pending', 'confirmed', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const { rows } = await pool.query(
      'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
      [status, id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, updateStatus };
