const express = require('express');
const users = require("./auth_users.js").users; // Assuming you have users exported from auth_users.js
const books = require('./booksdb.js'); // Assuming you have books exported from booksdb.js
const public_users = express.Router();

// User Registration
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Unable to register user. Please provide both username and password" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let bookViews = Object.values(books);
  res.status(200).json({ books: bookViews });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json({ book: book });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(book => book.author === author);
  if (authorBooks.length > 0) {
    res.status(200).json({ books: authorBooks });
  } else {
    res.status(404).json({ message: "Books by the author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const titleBooks = Object.values(books).filter(book => book.title.includes(title));
  if (titleBooks.length > 0) {
    res.status(200).json({ books: titleBooks });
  } else {
    res.status(404).json({ message: "Books with the title not found" });
  }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    res.status(200).json({ reviews: book.reviews });
  } else {
    res.status(404).json({ message: "Reviews not found for the book" });
  }
});

module.exports.general = public_users;
