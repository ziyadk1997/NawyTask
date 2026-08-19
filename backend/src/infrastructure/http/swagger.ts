import fs from 'node:fs';
import path from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';

const controllerDir = path.resolve(__dirname, '../../interfaces/controllers');
const distControllerDir = path.resolve(__dirname, '../../dist/interfaces/controllers');

const apis: string[] = [];

if (fs.existsSync(controllerDir)) {
  apis.push(path.join(controllerDir, '*.ts'));
}

if (fs.existsSync(distControllerDir)) {
  apis.push(path.join(distControllerDir, '*.js'));
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NawyTask API',
      version: '1.0.0',
      description: 'Apartment listing API',
    },
    servers: [{ url: '/api/v1', description: 'API v1' }],
  },
  apis: apis.length > 0 ? apis : [path.join(controllerDir, '*.ts')],
};

const spec = swaggerJsdoc(options);

export default spec;
