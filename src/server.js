import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRoutes from './routers/contacts.routers.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export const setupServer = () => {
  const app = express();

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

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });

  app.use('/contacts', contactsRoutes); 

  app.use(notFoundHandler);
  app.use(errorHandler);
  app.use(express.json());

  return app; 
};





 
