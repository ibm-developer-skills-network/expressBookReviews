const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(
    (user) =>
      user.username === username &&
      user.password === password
  );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: "Invalid username or password"
    });
  }

  const accessToken = jwt.sign(
    { username },
    "access",
    { expiresIn: "1h" }
  );

  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({
    message: "User successfully logged in"
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  // Validate book ISBN
  if (!Object.prototype.hasOwnProperty.call(books, isbn)) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  // Validate review
  if (typeof review !== "string" || !review.trim()) {
    return res.status(400).json({
      message: "Review cannot be empty"
    });
  }

  // Add or update the authenticated user's review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added or updated successfully",
    reviews: books[isbn].reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  // Check whether the book exists
  if (!Object.prototype.hasOwnProperty.call(books, isbn)) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  // Check whether this user has reviewed the book
  if (!Object.prototype.hasOwnProperty.call(
    books[isbn].reviews,
    username
  )) {
    return res.status(404).json({
      message: "Review not found for this user"
    });
  }

  // Delete only the authenticated user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review successfully deleted",
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
