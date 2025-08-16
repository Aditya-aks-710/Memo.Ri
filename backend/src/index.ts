import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/userRoutes';
import contentRoutes from './routes/contentRoutes';
import cloudinary from 'cloudinary';

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI!)
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));

// API Routes
app.use('/api/v1', userRoutes);
app.use('/api/v1', contentRoutes);

// Server Startup
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});