import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getCache, setCache, clearCache } from '../services/cache.service.js';

const router = Router();
const POSTS_CACHE_KEY = 'posts';

// In-memory db
let posts = [
  { id: 1, title: 'İlk Post', content: 'Merhaba Blog!' }
];

router.get('/', authenticateToken, (req, res) => {
  try {
    const cached = getCache(POSTS_CACHE_KEY);

    if (cached) {
      return res.json({
        source: 'cache',
        data: [...cached]
      });
    }

    setCache(POSTS_CACHE_KEY, [...posts]);

    res.json({
      source: 'database',
      data: [...posts]
    });
  } catch (err) {
    console.error('GET /posts error:', err);
    res.status(500).json({ message: 'Posts fetch error' });
  }
});

router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title ve content zorunlu' });
    }

    const newPost = {
      id: posts.length + 1,
      title,
      content
    };

    posts.push(newPost);
    clearCache(POSTS_CACHE_KEY);

    res.status(201).json(newPost);
  } catch (err) {
    console.error('POST /posts error:', err);
    res.status(500).json({ message: 'Post create error' });
  }
});

router.put('/:id', authenticateToken, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    const post = posts.find(p => p.id === id);
    if (!post) {
      return res.status(404).json({ message: 'Post bulunamadı' });
    }

    if (title) post.title = title;
    if (content) post.content = content;

    clearCache(POSTS_CACHE_KEY);
    res.json(post);
  } catch (err) {
    console.error('PUT /posts error:', err);
    res.status(500).json({ message: 'Post update error' });
  }
});

router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const id = Number(req.params.id);
    posts = posts.filter(p => p.id !== id);

    clearCache(POSTS_CACHE_KEY);
    res.json({ message: 'Post silindi' });
  } catch (err) {
    console.error('DELETE /posts error:', err);
    res.status(500).json({ message: 'Post delete error' });
  }
});

export default router;
