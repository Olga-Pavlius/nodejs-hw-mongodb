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


// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.resolve(__dirname, '../.evn') }); // явно вказати шлях


import dotenv from 'dotenv';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import path from 'path';

// dotenv.config({ path: path.resolve(__dirname, '../.evn') });
// dotenv.config({ path: path.resolve(new URL(import.meta.url).pathname, '../.env') });
dotenv.config();

console.log('MONGODB_URL:', process.env.MONGODB_URL);


const startServer = async () => {
  // Логування перед підключенням
  console.log('Attempting to connect to MongoDB...');
  
  await initMongoConnection(); // Підключення до MongoDB

  // Логування після підключення
  console.log('MongoDB connection established.');

  const app = setupServer(); // Створення та налаштування Express сервера
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer(); // Виклик функції для запуску сервера

// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// export const initMongoConnection = async () => {
//   try {
//     console.log('MONGODB_URL:', process.env.MONGODB_URL);
//     if (!process.env.MONGODB_URL) {
//       console.error('MONGODB_URL is not defined!');
//       return;
//     }

//     await mongoose.connect(process.env.MONGODB_URL, {
//       dbName: process.env.MONGODB_DB,
//       user: process.env.MONGODB_USER,
//       pass: process.env.MONGODB_PASSWORD,
//     });

//     console.log('MongoDB connection successfully established!');

//     // Тестовий запит для перевірки підключення
//     const result = await mongoose.connection.db.collection('contacts').findOne({});
//     console.log('Test Query Result:', result);

//   } catch (error) {
//     console.error('MongoDB connection error:', error.message);
//     process.exit(1);
//   }
// };

// initMongoConnection();
