import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getCache, setCache, clearCache } from '../services/cache.service.js';
import { getAllPosts,addPost,updatePost,deletePost} from '../data/posts.data.js';

const router = Router();

//get sadece giriş yapan kullanıcının postlarını getirir
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

    const allPosts = getAllPosts();
    const userPosts = allPosts.filter(
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

//post sadece kendine yeni post oluşturur 
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title ve content zorunlu' });
    }

    const allPosts = getAllPosts();

    const newPost = {
      id: allPosts.length + 1,
      title,
      content,
      owner: req.user.username
    };

    addPost(newPost);
    clearCache(`posts_${req.user.username}`);

    res.status(201).json(newPost);

  } catch (err) {
    console.error('POST /posts error:', err);
    res.status(500).json({ message: 'Post create error' });
  }
});

// put sadece kendi postunu günceller 
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    const allPosts = getAllPosts();
    const post = allPosts.find(
      p => p.id === id && p.owner === req.user.username
    );

    if (!post) {
      return res.status(404).json({ message: 'Post bulunamadı' });
    }

    if (title) post.title = title;
    if (content) post.content = content;

    updatePost(post);
    clearCache(`posts_${req.user.username}`);

    res.json(post);

  } catch (err) {
    console.error('PUT /posts error:', err);
    res.status(500).json({ message: 'Post update error' });
  }
});

//delete post sadece kendi postunu siler
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const id = Number(req.params.id);

    const allPosts = getAllPosts();
    const post = allPosts.find(
      p => p.id === id && p.owner === req.user.username
    );

    if (!post) {
      return res.status(404).json({ message: 'Post bulunamadı' });
    }

    deletePost(id);
    clearCache(`posts_${req.user.username}`);

    res.json({ message: 'Post silindi' });

  } catch (err) {
    console.error('DELETE /posts error:', err);
    res.status(500).json({ message: 'Post delete error' });
  }
});

export default router;
