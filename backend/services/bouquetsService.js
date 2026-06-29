const { Op } = require('sequelize');
const Bouquet = require('../models/Bouquet');
const HttpError = require('../helpers/HttpError');
const gravatar = require('gravatar');

/**
 * Find all bouquets paginated and filtered.
 */
async function findAllPaginated(filters) {
  const {
    page,
    limit,
    category,
    search,
    minPrice,
    maxPrice,
    bestsellerOnly,
  } = filters;
  const offset = (page - 1) * limit;

  const where = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) {
      where.price[Op.gte] = parseFloat(minPrice);
    }
    if (maxPrice) {
      where.price[Op.lte] = parseFloat(maxPrice);
    }
  }

  if (bestsellerOnly) {
    where.is_bestseller = true;
  }

  const { rows, count } = await Bouquet.findAndCountAll({
    where,
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

async function findById(id) {
  const row = await Bouquet.findByPk(id);
  return row;
}

async function create(data) {
  const { title, description, price, photoURL, category, is_bestseller, favorite } = data;

  // Generate gravatar url if photoURL is not provided
  let finalPhotoURL = photoURL;
  if (!finalPhotoURL) {
    const email = `${title.toLowerCase().replace(/[^a-z0-9]/g, '')}@flora.com`;
    // Secure URL generation, default to identicon
    finalPhotoURL = gravatar.url(email, { s: '200', r: 'g', d: 'identicon' }, true);
  }

  const row = await Bouquet.create({
    title,
    description,
    price,
    photoURL: finalPhotoURL,
    category,
    is_bestseller,
    favorite,
  });

  return row;
}

async function updateById(id, data) {
  const row = await Bouquet.findByPk(id);
  if (!row) {
    throw new HttpError(404, 'Bouquet not found');
  }

  await row.update(data);
  return row;
}

async function deleteById(id) {
  const row = await Bouquet.findByPk(id);
  if (!row) {
    throw new HttpError(404, 'Bouquet not found');
  }

  await row.destroy();
  return id;
}

async function updateStatus(id, favorite) {
  const row = await Bouquet.findByPk(id);
  if (!row) {
    throw new HttpError(404, 'Bouquet not found');
  }

  await row.update({ favorite });
  return row;
}

async function updatePhoto(id, photoURL) {
  const row = await Bouquet.findByPk(id);
  if (!row) {
    throw new HttpError(404, 'Bouquet not found');
  }

  await row.update({ photoURL });
  return row;
}

module.exports = {
  findAllPaginated,
  findById,
  create,
  updateById,
  deleteById,
  updateStatus,
  updatePhoto,
};
