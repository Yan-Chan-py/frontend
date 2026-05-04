const pool = require('../db/db');
const { validationResult } = require('express-validator');

/**
 * GET /api/bouquets
 * Query params: page, limit, category, search, minPrice, maxPrice, bestseller
 */
const getAll = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 15));
    const offset = (page - 1) * limit;

    const { category, search, minPrice, maxPrice, bestseller } = req.query;

    const conditions = [];
    const params = [];
    let idx = 1;

    if (category) {
      conditions.push(`category = $${idx++}`);
      params.push(category);
    }

    if (search) {
      conditions.push(`(name ILIKE $${idx} OR description ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    if (minPrice) {
      conditions.push(`price >= $${idx++}`);
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      conditions.push(`price <= $${idx++}`);
      params.push(parseFloat(maxPrice));
    }

    if (bestseller === 'true') {
      conditions.push(`is_bestseller = TRUE`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total count
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM bouquets ${where}`,
      params
    );
    const total = parseInt(countRes.rows[0].count);

    // Paginated data
    const dataRes = await pool.query(
      `SELECT * FROM bouquets ${where}
       ORDER BY created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    res.json({
      data: dataRes.rows,
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
 * GET /api/bouquets/:id
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM bouquets WHERE id = $1', [id]);

    if (!rows.length) {
      return res.status(404).json({ message: 'Bouquet not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/bouquets
 */
const create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, price, image_url, category, is_bestseller } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO bouquets (name, description, price, image_url, category, is_bestseller)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price, image_url || null, category || 'general', is_bestseller || false]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/bouquets/:id
 */
const update = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, description, price, image_url, category, is_bestseller } = req.body;

    const { rows } = await pool.query(
      `UPDATE bouquets
       SET name=$1, description=$2, price=$3, image_url=$4,
           category=$5, is_bestseller=$6
       WHERE id=$7
       RETURNING *`,
      [name, description, price, image_url, category, is_bestseller, id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Bouquet not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/bouquets/:id
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'DELETE FROM bouquets WHERE id=$1 RETURNING id',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Bouquet not found' });
    }

    res.json({ message: 'Bouquet deleted', id: rows[0].id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
