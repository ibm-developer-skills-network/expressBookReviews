const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

// Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://api-url/books');
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch book list' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://api-url/books/${isbn}`);
    return res.json(response.data);
  } catch (error) {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://api-url/books?author=${author}`);
    return res.json(response.data);
  } catch (error) {
    return res.status(404).json({ message: 'No books found for the author' });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();
  try {
    const response = await axios.get(`http://api-url/books?title=${title}`);
    return res.json(response.data);
  } catch (error) {
    return res.status(404).json({ message: 'No books found with the title' });
  }
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://api-url/books/${isbn}/reviews`);
    return res.json(response.data);
  } catch (error) {
    return res.status(404).json({ message: 'Book reviews not found' });
  }
});

module.exports.general = public_users;
