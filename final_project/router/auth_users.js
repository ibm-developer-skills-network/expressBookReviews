const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    const user = users.find((user) => user.username === username);
    return !!user;
  };
  

const authenticatedUser = (username, password) => {
    const user = users.find((user) => user.username === username && user.password === password);
    return !!user;
  };
  

// only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (authenticatedUser(username, password)) {
      const accessToken = jwt.sign({ username }, "secret-key");
      req.session.authorization = { accessToken };
      return res.status(200).json({ message: "Customer successfully logged in!"});
    }
  
    return res.status(401).json({ message: "Invalid username or password" });
  });
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const { username } = req.session.authorization;
  
    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }
  
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!book.reviews[username]) {
      book.reviews[username] = review;
      return res.status(200).json({ message: "The review for the book with the ISBN: " + isbn + " has been added successfully!" });
    } else {
      book.reviews[username] = review;
      return res.status(200).json({ message: "Review modified successfully" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username } = req.session.authorization;
  
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  });
  


  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;