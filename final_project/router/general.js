const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

public_users.get('/', (req, res) => {
  axios.get('http://localhost:5000/books')
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Error retrieving books",
        error: err
      });
    });
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.send(response.data);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.send(response.data);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.send(response.data);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const bookId = req.params.isbn;

  if (books[bookId]) {
    if (Object.keys(books[bookId].reviews).length > 0) {
      res.json({
        success: true,
        message: `Reviews for book ${bookId} found`,
        reviews: books[bookId].reviews
      });
    } else {
      res.status(404).json({
        success: false,
        message: `No reviews found for book ${bookId}`
      });
    }
  } else {
    res.status(404).json({
      success: false,
      message: `Book with id ${bookId} not found`
    });
  }
});

module.exports.general = public_users;

