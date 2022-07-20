const User = require('../models/user');

const initialUsers = [
  {
    username: 'user1',
    name: 'User 1',
    password: 'user1',
  },
  {
    username: 'user2',
    name: 'User 2',
    password: 'user2',
  },
];

async function usersInDb() {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
}

module.exports = {
  initialUsers,
  usersInDb,
};
