require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const bouquetsRouter = require('./routes/bouquets');
const ordersRouter = require('./routes/orders');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ─── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// ─── Swagger / OpenAPI ─────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flora API',
      version: '1.0.0',
      description: 'REST API for Flora Flower Boutique',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3001}` }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ────────────────────────────────────────────────────
app.use('/api/bouquets', bouquetsRouter);
app.use('/api/orders', ordersRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
