import dotenv from 'dotenv';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

dotenv.config();

console.log('MONGODB_URL:', process.env.MONGODB_URL);


const startServer = async () => {
 
  console.log('Attempting to connect to MongoDB...');
  
  await initMongoConnection(); 

  console.log('MongoDB connection established.');

  const app = setupServer(); 
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer(); 
