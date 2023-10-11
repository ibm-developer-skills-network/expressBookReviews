const express = require('express');
const books = require('./booksdb.js');
const { isValid } = require('./auth_users.js');

const publicUsersRouter = express.Router();

const getAllBooks = async (req, res) => {
  return new Promise((resolve, reject) => {
    const booksList = books;
    const booksListJSON = JSON.stringify(booksList, null, 2);
    resolve(booksListJSON);
  });
};

const getBookByISBN = async (req, res) => {
  return new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
      reject({ status: 404, message: 'Book not found' });
    } else {
      resolve(book);
    }
  });
};

const getBooksByAuthor = async (req, res) => {
  return new Promise((resolve, reject) => {
    const author = req.params.author;
    const matchingBooks = Object.entries(books).filter(([_, book]) => book.author === author);
    if (matchingBooks.length === 0) {
      reject({ status: 404, message: 'No books found for the provided author' });
    } else {
      resolve(matchingBooks);
    }
  });
};

const getBooksByTitle = async (req, res) => {
  return new Promise((resolve, reject) => {
    const title = req.params.title;
    const matchingBooks = Object.entries(books).filter(([_, book]) => book.title === title);
    if (matchingBooks.length === 0) {
      reject({ status: 404, message: 'No books found for the provided title' });
    } else {
      resolve(matchingBooks);
    }
  });
};

const getBookReviewsByISBN = async (req, res) => {
  return new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
      reject({ status: 404, message: 'Book not found' });
    } else {
      const reviews = book.reviews || [];
      resolve({ reviews });
    }
  });
};

// Register user
const registerUser = async (req, res) => {
  return new Promise((resolve, reject) => {
    const { username, password } = req.body;
    if (!username || !password) {
      reject({ status: 400, message: 'Both username and password are required.' });
    }
    // Check if the username already exists
    if (users[username]) {
      reject({ status: 409, message: 'Username already exists.' });
    }
    users[username] = { password }; // For simplicity, only storing the password
    resolve({ status: 200, message: 'User registered successfully.' });
  });
};

publicUsersRouter.post('/register', async (req, res) => {
  try {
    const result = await registerUser(req, res);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
});

publicUsersRouter.get('/', async (req, res) => {
  try {
    const result = await getAllBooks(req, res);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

publicUsersRouter.get('/isbn/:isbn', async (req, res) => {
  try {
    const result = await getBookByISBN(req, res);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
});

publicUsersRouter.get('/author/:author', async (req, res) => {
  try {
    const result = await getBooksByAuthor(req, res);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
});

publicUsersRouter.get('/title/:title', async (req, res) => {
  try {
    const result = await getBooksByTitle(req, res);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
});

publicUsersRouter.get('/review/:isbn', async (req, res) => {
  try {
    const result = await getBookReviewsByISBN(req, res);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
});

module.exports.general = publicUsersRouter;
