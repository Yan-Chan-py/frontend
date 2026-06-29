const asyncHandler = require('../middlewares/asyncHandler');
const ordersService = require('../services/ordersService');

const create = asyncHandler(async (req, res) => {
  const row = await ordersService.create(req.body);
  res.status(201).json({
    message: 'Order placed successfully',
    order: row,
  });
});

const getAll = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const result = await ordersService.findAllPaginated(page, limit);
  res.json(result);
});

const updateStatus = asyncHandler(async (req, res) => {
  const row = await ordersService.updateStatus(req.params.id, req.body.status);
  res.json(row);
});

module.exports = { create, getAll, updateStatus };
