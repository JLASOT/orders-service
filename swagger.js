import swaggerAutogen from 'swagger-autogen';
const outputFile = './swagger.json';
const endpointsFiles = ['./index.js', './routes/ordersRutes.js', './routes/products.js'];
const doc = {
  info: {
    title: 'Servicio 2 - API de Productos y Órdenes',
    description: 'API para gestionar productos y órdenes en el servicio 2.',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  tags: [
    {
      name: 'Productos',
      description: 'Operaciones relacionadas con productos.',
    },
    {
      name: 'Órdenes',
      description: 'Operaciones relacionadas con órdenes.',
    },
  ],
};

swaggerAutogen(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log('Swagger documentation generated successfully!');
  })
  .catch((error) => {
    console.error('Error generating Swagger documentation:', error);
  });