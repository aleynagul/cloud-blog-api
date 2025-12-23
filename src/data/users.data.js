let users = [
  { id: 1, username: 'aley', password: '1234' }
];

export function getUser(username) {
  return users.find(u => u.username === username);
}

export function addUser(username, password) {
  const user = {
    id: users.length + 1,
    username,
    password
  };
  users.push(user);
  return user;
}
    