const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.includes(username);
};

const authenticatedUser = (username, password) => {
  const validUsername = "user1";
  const validPassword = "pass1";

  return username === validUsername && password === validPassword;
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Unauthorized: Username does not exist" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Unauthorized: Invalid username or password" });
  }

  const token = jwt.sign({ username }, 'secret1');

  req.session.authenticated = true;
  req.session.token = token;

  res.status(200).json({ message: "Login successful", token });
});

regd_users.post("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  if (!isbn || !review) {
    return res.status(400).json({ message: "ISBN and review are required" });
  }

  const book = books[isbn];

  if (book) {
    if (!book.reviews) {
      book.reviews = {};
    }
    const username = req.session.username;
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review added/modified successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  const book = books[isbn];

  if (book) {
    const username = req.session.username;
    if (book.reviews && book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users; 