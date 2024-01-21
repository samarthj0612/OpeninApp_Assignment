const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const client = require("../database/db");

require('dotenv').config();

const database = client.db('openinapp');
const collections = {
  user: database.collection('user')
};
const secretKey = process.env.JWT_SECRET_KEY;


const root = async (req, res) => {
  res.status(200).json({ message: "API successfully called" });
}

const register = async (req, res) => {
  try {
    const data = req.body;
    if (!data.mobile || !data.password)
      return res.status(400).json({ error: 'Mobile and password are required' });

    const { username, mobile, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    await collections.user.insertOne({ user: username, mob: mobile, pwd: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

const login = async (req, res) => {
  try {
    const data = req.body;
    if (!data.mobile || !data.password)
      return res.status(400).json({ error: 'Mobile and password are required' });

    const { mobile, password } = data;

    const user = await collections.user.findOne({ mob: mobile }, {projection: { _id: 0 }});
    if (!user) {
      return res.status(401).json({ message: 'User not found', error: 'Authentication failed' });
    }

    const passwordMatch = await bcrypt.compare(password, user.pwd);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: '1h',
    });

    res.cookie('jwt', token, { httpOnly: true, secure: true });
    res.status(200).json({ message: "User successfully logged in", user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Login failed' });
  }
}

const logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logout successful' });
}

module.exports = {root, register, login, logout}