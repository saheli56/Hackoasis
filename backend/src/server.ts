import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { json } from 'express';
import { geminiRouter } from './routes/gemini';

const app = express();
app.use(cors());
app.use(json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend', timestamp: new Date().toISOString() });
});

app.use('/api/ai', geminiRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[backend] server running on port ${PORT}`);
});
