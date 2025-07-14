import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import passport from 'passport';
import { configureGoogleStrategy } from './config/passport';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

configureGoogleStrategy();

app.use(passport.initialize());
// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);



// Server and Database Connection
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined in .env file');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.error('Failed to connect or start server:', error);
    process.exit(1);
  }
};

startServer();