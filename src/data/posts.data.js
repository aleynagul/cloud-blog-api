import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'posts.json');

function readPosts() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writePosts(posts) {
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
}

export function getAllPosts() {
  return readPosts();
}

export function addPost(post) {
  const posts = readPosts();
  posts.push(post);
  writePosts(posts);
  return post;
}

export function updatePost(updatedPost) {
  const posts = readPosts();
  const index = posts.findIndex(p => p.id === updatedPost.id);
  posts[index] = updatedPost;
  writePosts(posts);
  return updatedPost;
}

export function deletePost(id) {
  const posts = readPosts().filter(p => p.id !== id);
  writePosts(posts);
}
