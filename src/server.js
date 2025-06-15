import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import redoc from 'redoc-express';

import contactsRoutes from './routers/contacts.routers.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export const setupServer = () => {
  const app = express();

  // Redoc UI для документації
  app.get(
    '/api-docs',
    redoc({
      title: 'Contacts API Docs',
      specUrl: '/docs/openapi.yaml',
    })
  );

  // Віддаємо файл документації
  app.use('/docs', express.static('docs'));

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    })
  );

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });

  app.use('/contacts', contactsRoutes);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
