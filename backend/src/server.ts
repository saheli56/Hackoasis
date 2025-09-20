import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { json } from 'express';
import mongoose from 'mongoose';
import { geminiRouter } from './routes/gemini';
import { companyRouter } from './routes/company';

const app = express();
app.use(cors());
app.use(json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://insane_odyssey:mdHV8k3WfB08BbdO@cluster0.3kri8jx.mongodb.net/';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Form data schema
const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const FormData = mongoose.model('FormData', formDataSchema);

// API route to save form data
app.post('/api/form-data', async (req, res) => {
  try {
    const formData = new FormData(req.body);
    await formData.save();
    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ error: 'Failed to save form data' });
  }
});

// Get all form data
app.get('/api/form-data', async (req, res) => {
  try {
    const data = await FormData.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(500).json({ error: 'Failed to fetch form data' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend', timestamp: new Date().toISOString() });
});

app.use('/api/ai', geminiRouter);
app.use('/api/company', companyRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[backend] server running on port ${PORT}`);
});
