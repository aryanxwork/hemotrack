const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../swagger/swagger');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN,
    /https:\/\/hemotrack-.*\.vercel\.app$/,
    "https://hemotrack.vercel.app"
  ].filter(Boolean),
  credentials: true
}));

// Rate Limiting
app.use('/api', rateLimiter);

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Swagger Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use('/api', routes);

// Error Handling
app.use(errorHandler);

module.exports = app;
