import {
  getAllPosts,
  addPost,
  updatePost,
  deletePost,
} from "../data/posts.data.js";

import {
  getCache,
  setCache,
  deleteCache,
} from "../services/cache.service.js";

export const getAllPostsController = async (req, res) => {
  try {
    const username = req.user.username;
    const cacheKey = `posts:user:${username}`;

    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const posts = getAllPosts().filter(
      p => p.owner === username
    );

    await setCache(cacheKey, posts, 120);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const username = req.user.username;

    const cacheKey = `posts:id:${id}:${username}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const post = getAllPosts().find(
      p => String(p.id) === String(id) && p.owner === username
    );

    if (!post) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    await setCache(cacheKey, post, 120);

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createPostController = async (req, res) => {
  try {
    const { title, content } = req.body;
    const username = req.user.username;

    if (!title || !content) {
      return res.status(400).json({ message: "title ve content zorunlu" });
    }

    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      owner: username,
    };

    addPost(newPost);

    await deleteCache(`posts:user:${username}`);

    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePostController = async (req, res) => {
  try {
    const username = req.user.username;
    const updatedPost = {
      ...req.body,
      id: req.params.id,
      owner: username,
    };

    updatePost(updatedPost);

    await deleteCache(`posts:user:${username}`);
    await deleteCache(`posts:id:${req.params.id}:${username}`);

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePostController = async (req, res) => {
  try {
    const username = req.user.username;
    const { id } = req.params;

    deletePost(id);

    await deleteCache(`posts:user:${username}`);
    await deleteCache(`posts:id:${id}:${username}`);

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
