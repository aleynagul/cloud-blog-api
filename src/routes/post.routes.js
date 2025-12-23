import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getCache, setCache, clearCache } from '../services/cache.service.js';

const router = Router();

// In-memory db
let posts = [
  { id: 1, title: 'İlk Post', content: 'Merhaba Blog!', owner: 'aley' }
];

// Get post, sadece kendi postları
router.get('/', authenticateToken, (req, res) => {
  try {
    const cacheKey = `posts_${req.user.username}`;
    const cached = getCache(cacheKey);

    if (cached) {
      return res.json({
        source: 'cache',
        data: cached
      });
    }

    const userPosts = posts.filter(
      p => p.owner === req.user.username
    );

    setCache(cacheKey, userPosts);

    res.json({
      source: 'database',
      data: userPosts
    });

  } catch (err) {
    console.error('GET /posts error:', err);
    res.status(500).json({ message: 'Posts fetch error' });
  }
});

// create post
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title ve content zorunlu' });
    }

    const newPost = {
      id: posts.length + 1,
      title,
      content,
      owner: req.user.username
    };

    posts.push(newPost);

    // sadece bu kullanıcının cache'ini temizle
    clearCache(`posts_${req.user.username}`);

    res.status(201).json(newPost);

  } catch (err) {
    console.error('POST /posts error:', err);
    res.status(500).json({ message: 'Post create error' });
  }
});

// Update post ,sadece kendi postunu
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    const post = posts.find(
      p => p.id === id && p.owner === req.user.username
    );

    if (!post) {
      return res.status(404).json({ message: 'Post bulunamadı' });
    }

    if (title) post.title = title;
    if (content) post.content = content;

    clearCache(`posts_${req.user.username}`);
    res.json(post);

  } catch (err) {
    console.error('PUT /posts error:', err);
    res.status(500).json({ message: 'Post update error' });
  }
});

// delete post, sadece kendi postunu
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const id = Number(req.params.id);

    const post = posts.find(
      p => p.id === id && p.owner === req.user.username
    );

    if (!post) {
      return res.status(404).json({ message: 'Post bulunamadı' });
    }

    posts = posts.filter(p => p.id !== id);

    clearCache(`posts_${req.user.username}`);
    res.json({ message: 'Post silindi' });

  } catch (err) {
    console.error('DELETE /posts error:', err);
    res.status(500).json({ message: 'Post delete error' });
  }
});

export default router;
