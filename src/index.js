// import dotenv from 'dotenv';
// import { setupServer } from './server.js';
// import { initMongoConnection } from './db/initMongoConnection.js';

// dotenv.config();


// const startServer = async () => {
  
//   await initMongoConnection(); 

//   const app = setupServer(); 
//   const PORT = process.env.PORT || 3000;

//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// };

// startServer(); 


import dotenv from 'dotenv';
import express from 'express';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import contactsRouter from './routes/contacts.routes.js'; // або правильний шлях

dotenv.config();

const startServer = async () => {
  await initMongoConnection(); 

  const app = setupServer(); 
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // ✅ Підключення маршруту без помилок
  app.use('/api', contactsRouter);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
