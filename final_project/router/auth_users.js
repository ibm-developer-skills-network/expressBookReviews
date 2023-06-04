const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return !!user;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("Please provide both username and password");
  }

  const user = users.find((user) => user.username === username);

  if (!user || user.password !== password) {
    res.status(401).json({ message: "Invalid username or password" });
  } else {
    const token = jwt.sign({ username }, "secret_key");
    req.session.token = token;
    res.status(200).json({ message: "Login successful", token });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;
  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }
  if (!username) {
    return res.status(401).json({ message: "User is not logged in" });
  }
  const book = books.find((item) => item.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const userReview = book.reviews[username];
  if (userReview) {
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review modified successfully" });
  } else {
    book.reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  if (!username) {
    return res.status(401).json({ message: "User is not logged in" });
  }

  const book = books.find((item) => item.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const userReview = book.reviews[username];
  if (!userReview) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete book.reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
