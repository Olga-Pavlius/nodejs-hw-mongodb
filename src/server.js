import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import redoc from 'redoc-express';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

import contactsRoutes from './routers/contacts.routers.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export const setupServer = () => {
  const app = express();

  // Swagger JSON (для Swagger UI)
  const swaggerJsonPath = path.resolve('docs', 'swagger.json');
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf-8'));

  // Swagger UI documentation
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

  // ReDoc documentation
  app.get(
    '/redoc',
    redoc({
      title: 'Contacts API Docs',
      specUrl: '/docs/openapi.yaml',
    })
  );

  // Static YAML access
  app.use('/docs', express.static('docs'));

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
  });

  app.use('/contacts', contactsRoutes);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
