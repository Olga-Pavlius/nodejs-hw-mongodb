import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRoutes from './routes/contacts.routes.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.use('/api', contactsRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  return app;
};
