const Order = require('../models/Order');
const HttpError = require('../helpers/HttpError');

const ALLOWED_STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled'];

async function create(data) {
  const { name, phone, address, message, product, quantity } = data;
  const qty = Math.min(99, Math.max(1, parseInt(quantity, 10) || 1));

  const row = await Order.create({
    name,
    phone,
    address: address || null,
    message: message || null,
    product: product || null,
    quantity: qty,
  });

  return row;
}

async function findAllPaginated(page, limit) {
  const offset = (page - 1) * limit;

  const { rows, count } = await Order.findAndCountAll({
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  return {
    data: rows,
    total: count,
    page,
    perPage: limit,
    totalPages: Math.ceil(count / limit),
  };
}

async function updateStatus(id, status) {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new HttpError(
      400,
      `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`
    );
  }

  const row = await Order.findByPk(id);
  if (!row) {
    throw new HttpError(404, 'Order not found');
  }

  await row.update({ status });
  return row;
}

module.exports = {
  create,
  findAllPaginated,
  updateStatus,
};
