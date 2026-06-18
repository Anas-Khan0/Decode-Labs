// ============================================================
//  Express application setup.
// ============================================================
import express from 'express';
import cors from 'cors';
import authorsRouter from './routes/authors.routes.js';
import booksRouter from './routes/books.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json()); // parse JSON request bodies

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'Book Library API',
    status: 'ok',
    endpoints: ['/api/authors', '/api/books'],
  });
});

// Feature routes
app.use('/api/authors', authorsRouter);
app.use('/api/books', booksRouter);

// 404 + centralized error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
