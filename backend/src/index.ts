import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import escrowRoutes from './routes/escrow';
import farmerRoutes from './routes/farmer';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'AcreLedger API is running' });
});

// API Routes
app.use('/api/v1/escrow', escrowRoutes);
app.use('/api/v1/farmer', farmerRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found', message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AcreLedger server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Stellar Network: ${process.env.STELLAR_NETWORK || 'testnet'}`);
});

export default app;
