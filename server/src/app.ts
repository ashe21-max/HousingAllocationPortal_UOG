import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Application, type Request, type Response } from 'express';
import { handleError } from './errorHandler/handle-error.js';
import { apiRouter } from './routes/index.js';

const app: Application = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const isProduction = process.env.NODE_ENV === 'production';

// Allow network origins in development
const corsOrigin = isProduction 
  ? FRONTEND_ORIGIN 
  : (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, curl requests, Postman)
      if (!origin) return callback(null, true);
      
      // Allow localhost and network IPs
      if (origin.startsWith('http://localhost:') || 
          origin.startsWith('http://127.0.0.1:') ||
          /^\d+\.\d+\.\d+\.\d+/.test(origin.replace('http://', '').split(':')[0])) {
        return callback(null, true);
      }
      
      return callback(null, true); // Allow all in development
    };

app.use(
  cors({
    origin: corsOrigin,
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

const server = app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server also accessible at http://10.139.27.157:${PORT}`);
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
