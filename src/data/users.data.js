import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/users.json');

function readUsers() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

export function getUser(username) {
  const users = readUsers();
  return users.find(u => u.username === username);
}

export function addUser(username, password) {
  const users = readUsers();

  const newUser = {
    id: users.length + 1,
    username,
    password
  };

  users.push(newUser);
  writeUsers(users);

  return newUser;
}
