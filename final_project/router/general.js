const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get('/books', async function (req, res) {
  try {
    const response = await axios.get('https://slukaivars-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books');
    const bookList = response.data;
    return res.status(200).json(bookList);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`https://slukaivars-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/books/${isbn}`);
    const bookDetails = response.data;
    return res.status(200).json(bookDetails);
  } catch (error) {
    console.error(`Error fetching book with ISBN ${isbn}:`, error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
});

public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params;
  try {
    const response = await axios.get(`https://slukaivars-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books?author=${author}`);
    const booksByAuthor = response.data;
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Author not found" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
});

public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params;
  try {
    const response = await axios.get(`https://slukaivars-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books?title=${title}`);
    const booksByTitle = response.data;
    return res.status(200).json(booksByTitle);
  } catch (error) {
    console.error(`Error fetching books by title ${title}:`, error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Title not found" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
///unnecessarychangetobeabletopush?