import { Router } from "express";
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getCache, setCache } from '../services/cache.service.js';


const router=Router();

let post = [
    {
      id: 1, title: 'İlk Post', content: 'Merhaba Aley!'
    }
]
//read-get post
router.get('/',authenticateToken ,(req,res) => {
    const cached = getCache('posts');
    if(cached){
        return res.json({ source: 'cache',data:cached});
    }
    setCache('posts',posts);
    res.json({source: 'database', data : cached});
});

//create post
router.post('/',authenticateToken ,(req,res) => {
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
  clearCache('posts');

  res.status(201).json(newPost);


});

//update put 

router.put('/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;

  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ message: 'Post bulunamadı' });
  }

  post.title = title ?? post.title;
  post.content = content ?? post.content;

  clearCache('posts');
  res.json(post);
});

//delete

router.delete('/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const lengthBefore = posts.length;

  posts = posts.filter(p => p.id !== id);

  if (posts.length === lengthBefore) {
    return res.status(404).json({ message: 'Post bulunamadı' });
  }

  clearCache('posts');
  res.json({ message: 'Post silindi' });
});

export default router;