const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const config = require('./config');
const bouquetsRouter = require('./routes/bouquets');
const ordersRouter = require('./routes/orders');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ─── Middleware ────────────────────────────────────────────────
app.use(
  cors({
    origin: config.clientUrl === '*' ? '*' : config.clientUrl,
  })
);
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Swagger / OpenAPI ─────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flora API',
      version: '1.0.0',
      description: 'REST API for Flora Flower Boutique',
    },
    servers: [{ url: `http://localhost:${config.port}` }],
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ────────────────────────────────────────────────────
app.use('/api/bouquets', bouquetsRouter);
app.use('/api/orders', ordersRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
