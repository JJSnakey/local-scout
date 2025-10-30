// /src/server.ts
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import placesRouter from './routes/places';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Middleware (express)
app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost:80',
    //include instance IP here for prod
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/places', placesRouter);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString() 
    });
});

// Start server - listen on 0.0.0.0 to accept connections from outside container
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Local Scout backend running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API Key configured: ${process.env.GOOGLE_PLACES_API_KEY ? 'Yes' : 'No'}`);
});
