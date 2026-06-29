const fs = require('fs/promises');
const path = require('path');
const asyncHandler = require('../middlewares/asyncHandler');
const bouquetsService = require('../services/bouquetsService');
const HttpError = require('../helpers/HttpError');

const getAll = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 15));
  const { category, search, minPrice, maxPrice, bestseller } = req.query;

  const result = await bouquetsService.findAllPaginated({
    page,
    limit,
    category,
    search,
    minPrice,
    maxPrice,
    bestsellerOnly: bestseller === 'true',
  });
  res.json(result);
});

const getById = asyncHandler(async (req, res) => {
  const row = await bouquetsService.findById(req.params.id);
  if (!row) {
    throw new HttpError(404, 'Bouquet not found');
  }
  res.json(row);
});

const create = asyncHandler(async (req, res) => {
  const row = await bouquetsService.create(req.body);
  res.status(201).json(row);
});

const update = asyncHandler(async (req, res) => {
  const row = await bouquetsService.updateById(req.params.id, req.body);
  res.json(row);
});

const remove = asyncHandler(async (req, res) => {
  const id = await bouquetsService.deleteById(req.params.id);
  res.json({ message: 'Bouquet deleted', id });
});

const updateFavorite = asyncHandler(async (req, res) => {
  const { favorite } = req.body;
  const row = await bouquetsService.updateStatus(req.params.id, favorite);
  res.json(row);
});

const updatePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new HttpError(400, 'Image file is required');
  }

  const { path: tempPath, originalname } = req.file;
  const uniqueName = `${req.params.id}_${Date.now()}${path.extname(originalname)}`;
  const publicDir = path.join(__dirname, '..', 'public', 'photos');
  const targetPath = path.join(publicDir, uniqueName);

  try {
    // Ensure public/photos directory exists
    await fs.mkdir(publicDir, { recursive: true });

    // Move file from temp to public/photos
    await fs.rename(tempPath, targetPath);

    // Save relative URL path in DB
    const photoURL = `/photos/${uniqueName}`;
    const row = await bouquetsService.updatePhoto(req.params.id, photoURL);

    res.json(row);
  } catch (err) {
    // Cleanup temp file if error occurs
    try {
      await fs.unlink(tempPath);
    } catch (_) {}
    throw err;
  }
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  updateFavorite,
  updatePhoto,
};
