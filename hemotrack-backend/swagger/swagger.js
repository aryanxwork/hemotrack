const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HemoTrack API',
      version: '1.0.0',
      description: 'API documentation for the HemoTrack Blood Bank Management System backend.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      }
    ],
  },
  apis: ['./src/routes/*.js', './swagger/docs/*.yaml'], // Load routes or separate yaml files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
