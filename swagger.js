const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js API Documentation',
      version: '1.0.0',
      description: 'This is the API documentation for my Node.js project',
    },
    servers: [
      {
        url: 'http://localhost:8080', 
      },
    ],
  },
  apis: ['./routes/*.js'], // API'laringiz joylashgan papka
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
