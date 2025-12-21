import express from 'express';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';

const app = express();

// Middleware
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.send('Secure Cloud Blog API çalışıyor 🚀');
});

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

export default app;
