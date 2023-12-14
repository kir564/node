const bcrypt = require('bcrypt');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./constants');

const addUser = async (email, password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, password: passwordHash });
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User is not found');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error('Wrong password');
  }

  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '30d' });
};

module.exports = {
  addUser,
  loginUser,
};
