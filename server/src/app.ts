import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Application, type Request, type Response } from 'express';
import { handleError } from './errorHandler/handle-error.js';
import { apiRouter } from './routes/index.js';

const app: Application = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('The api is Running!!');
});

app.use('/api', apiRouter);

app.use(handleError);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});

// Keep the process alive
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  server.close(() => {
    process.exit(0);
  });
});

// Prevent the process from exiting
setInterval(() => {
  // This keeps the event loop alive
}, 1000);
