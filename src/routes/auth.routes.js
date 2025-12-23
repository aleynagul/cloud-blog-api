import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { addUser, getUser } from '../data/users.data.js';

const router = Router();
const JWT_SECRET = 'supersecretkey';

// REGISTER
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username ve password zorunlu' });
  }

  const existingUser = getUser(username);
  if (existingUser) {
    return res.status(409).json({ message: 'Kullanıcı zaten var' });
  }

  const newUser = addUser(username, password);
  res.status(201).json(newUser);
});

// LOGIN
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = getUser(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Geçersiz bilgiler' });
  }

  const token = jwt.sign(
    { username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

export default router;
