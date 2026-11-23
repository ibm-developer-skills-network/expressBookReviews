const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Error: username and/or password not provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Error: username already exists
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists!" });
  }

  // Register the new user
  users.push({ username: username, password: password });
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Task 10: get the list of books using async-await with Axios
public_users.get('/async/books', async function (req, res) {
    try {
      const response = await axios.get('http://localhost:5000/');
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      return res.status(500).json({ message: "Error fetching the list of books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Look up the book in the books object (keyed by ISBN)
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }

  return res.status(404).json({ message: "Book not found for the given ISBN" });
});

// Task 11: get book details by ISBN using async-await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: "Book not found for the given ISBN" });
      }
      return res.status(500).json({ message: "Error fetching book details" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Retrieve the author from the request parameters
  const author = req.params.author;

  // 1. Obtain all the keys of the books object
  const keys = Object.keys(books);

  // 2. Iterate through the books and collect those whose author matches
  const matchingBooks = [];
  keys.forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  }

  return res.status(404).json({ message: "No books found for the given author" });
});

// Task 12: get book details by author using async-await with Axios
public_users.get('/async/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
      const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: "No books found for the given author" });
      }
      return res.status(500).json({ message: "Error fetching book details by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Retrieve the title from the request parameters
  const title = req.params.title;

  // Obtain all the keys of the books object
  const keys = Object.keys(books);

  // Iterate through the books and collect those whose title matches
  const matchingBooks = [];
  keys.forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  }

  return res.status(404).json({ message: "No books found for the given title" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Book doesn't exist
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for the given ISBN" });
  }

  const reviews = books[isbn].reviews;

  // Book exists but has no reviews
  if (Object.keys(reviews).length === 0) {
    return res.status(200).json({ message: "No reviews found for this book." });
  }

  // Book has reviews
  return res.status(200).send(JSON.stringify(reviews, null, 4));
});

module.exports.general = public_users;
