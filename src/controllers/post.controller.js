import {
  getAllPosts,
  addPost,
  updatePost,
  deletePost,
} from "../data/posts.data.js";
import redisClient from "../config/redis.js";

export const getAllPostsController = async (req, res) => {
  try {
    const cacheKey = "posts:all";

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const posts = getAllPosts();

    await redisClient.setEx(
      cacheKey,
      120,
      JSON.stringify(posts)
    );

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getPostByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `posts:id:${id}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const posts = getAllPosts();
    const post = posts.find(p => String(p.id) === String(id));

    if (!post) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    await redisClient.setEx(
      cacheKey,
      300,
      JSON.stringify(post)
    );

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPostController = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "title ve content zorunlu" });
    }

    const newPost = {
      id: Date.now().toString(),
      title,
      content,
    };

    addPost(newPost);

    await redisClient.del("posts:all");

    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePostController = async (req, res) => {
  try {
    const updatedPost = {
      ...req.body,
      id: req.params.id,
    };

    updatePost(updatedPost);

    await redisClient.del("posts:all");
    await redisClient.del(`posts:id:${req.params.id}`);

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;

    deletePost(id);

    await redisClient.del("posts:all");
    await redisClient.del(`posts:id:${id}`);

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
