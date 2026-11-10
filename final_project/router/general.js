const express = require('express');
const axios = require('axios');

const publicUsers = express.Router();
const port = process.env.PORT || 5000;
const booksApiUrl = process.env.BOOKS_API_URL || `http://127.0.0.1:${port}/_internal/books`;

// Read the catalog through the app's JSON endpoint so these routes use Axios
// and keep retrieval/filtering behavior consistent with the HTTP API.
async function fetchBooks() {
  const response = await axios.get(booksApiUrl, { timeout: 5000 });
  return response.data;
}

function sendLookupError(res, error) {
  if (error.response) {
    return res.status(error.response.status).json({ message: 'Unable to retrieve books' });
  }
  return res.status(502).json({ message: 'Book catalog is unavailable' });
}

publicUsers.post('/register', (req, res) => {
  const { username, password } = req.body || {};
  const { isValid, users } = require('./auth_users.js');

  if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (!isValid(username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  users.push({ username: username.trim(), password });
  return res.status(201).json({ message: 'User successfully registered' });
});

// Get the complete book list.
publicUsers.get('/', async (_req, res) => {
  try {
    return res.json(await fetchBooks());
  } catch (error) {
    return sendLookupError(res, error);
  }
});

// Get book details by catalog key/ISBN.
publicUsers.get('/isbn/:isbn', async (req, res) => {
  try {
    const books = await fetchBooks();
    const book = books[req.params.isbn] || Object.values(books).find(
      (item) => String(item.isbn || '').toLowerCase() === req.params.isbn.toLowerCase()
    );
    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.json(book);
  } catch (error) {
    return sendLookupError(res, error);
  }
});

// Get all books by author (case-insensitive exact match).
publicUsers.get('/author/:author', async (req, res) => {
  try {
    const books = await fetchBooks();
    const author = req.params.author.trim().toLocaleLowerCase();
    const matches = Object.fromEntries(Object.entries(books).filter(
      ([, book]) => String(book.author || '').toLocaleLowerCase() === author
    ));
    if (Object.keys(matches).length === 0) return res.status(404).json({ message: 'No books found for this author' });
    return res.json(matches);
  } catch (error) {
    return sendLookupError(res, error);
  }
});

// Get all books with the specified title (case-insensitive exact match).
publicUsers.get('/title/:title', async (req, res) => {
  try {
    const books = await fetchBooks();
    const title = req.params.title.trim().toLocaleLowerCase();
    const matches = Object.fromEntries(Object.entries(books).filter(
      ([, book]) => String(book.title || '').toLocaleLowerCase() === title
    ));
    if (Object.keys(matches).length === 0) return res.status(404).json({ message: 'No books found with this title' });
    return res.json(matches);
  } catch (error) {
    return sendLookupError(res, error);
  }
});

// Return the review map for the requested book.
publicUsers.get('/review/:isbn', async (req, res) => {
  try {
    const books = await fetchBooks();
    const book = books[req.params.isbn] || Object.values(books).find(
      (item) => String(item.isbn || '').toLowerCase() === req.params.isbn.toLowerCase()
    );
    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.json(book.reviews || {});
  } catch (error) {
    return sendLookupError(res, error);
  }
});

module.exports.general = publicUsers;
