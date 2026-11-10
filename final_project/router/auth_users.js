const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');
const regdUsers = express.Router();

const users = [];
const jwtSecret = process.env.JWT_SECRET || 'replace-this-secret-in-production';

const isValid = (username) => !users.some((user) => user.username === username);
const authenticatedUser = (username, password) => users.some(
  (user) => user.username === username && user.password === password
);

regdUsers.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  req.session.user = username;
  const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
  return res.json({ message: 'User successfully logged in', username, token });
});

// Add or update the logged-in user's review for a book.
regdUsers.put('/auth/review/:isbn', (req, res) => {
  const username = req.user?.username || req.session?.user;
  if (!username) return res.status(401).json({ message: 'Authentication required' });

  const book = books[req.params.isbn] || Object.values(books).find(
    (item) => String(item.isbn || '').toLowerCase() === req.params.isbn.toLowerCase()
  );
  if (!book) return res.status(404).json({ message: 'Book not found' });
  const review = req.body?.review;
  if (typeof review !== 'string' || !review.trim()) {
    return res.status(400).json({ message: 'A non-empty review is required' });
  }

  book.reviews = book.reviews || {};
  book.reviews[username] = review.trim();
  return res.json({ message: 'Review added/updated successfully', reviews: book.reviews });
});

// Delete only the authenticated user's review.
regdUsers.delete('/auth/review/:isbn', (req, res) => {
  const username = req.user?.username || req.session?.user;
  if (!username) return res.status(401).json({ message: 'Authentication required' });

  const book = books[req.params.isbn] || Object.values(books).find(
    (item) => String(item.isbn || '').toLowerCase() === req.params.isbn.toLowerCase()
  );
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!book.reviews || !Object.prototype.hasOwnProperty.call(book.reviews, username)) {
    return res.status(404).json({ message: 'Review not found' });
  }

  delete book.reviews[username];
  return res.json({ message: 'Review deleted successfully', reviews: book.reviews });
});

module.exports.authenticated = regdUsers;
module.exports.authenticatedUser = authenticatedUser;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.jwtSecret = jwtSecret;
