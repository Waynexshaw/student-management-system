import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDatabaseStatus } from './config/db.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    success: true,
    message: 'Student Management API is running',
    database: getDatabaseStatus()
  });
});

app.listen(port, () => {
  console.log(`Student Management API listening on port ${port}`);
});
