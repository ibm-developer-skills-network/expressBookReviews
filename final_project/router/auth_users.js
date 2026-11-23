const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return typeof username === "string" && username.trim().length > 0;
};

// Check that the username and password match a registered user
const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

// Only registered users can log in
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Missing credentials
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Wrong username or password
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login. Check username and password" });
  }

  // Create the JWT
  const accessToken = jwt.sign({ data: username }, "access", { expiresIn: 60 * 60 });

  // Save the token and username in the session
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "Customer successfully logged in" });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;              // review comes as a query parameter
  const username = req.session.authorization.username;  // username stored at login

  // Book must exist
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for the given ISBN" });
  }

  // Review text must be provided
  if (!review) {
    return res.status(400).json({ message: "Review is required as a query parameter" });
  }

  // Was there already a review from this user?
  const isUpdate = books[isbn].reviews.hasOwnProperty(username);

  // Add a new review, or overwrite this user's existing one
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: isUpdate
      ? `Review for ISBN ${isbn} updated successfully`
      : `Review for ISBN ${isbn} added successfully`,
    reviews: books[isbn].reviews
  });
});

// Delete a book review (only the logged-in user's own review)
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;  // username stored at login
  
    // Book must exist
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
  
    // This user must have a review on this book
    if (!books[isbn].reviews.hasOwnProperty(username)) {
      return res.status(404).json({ message: "No review by this user found for this book" });
    }
  
    // Delete only this user's review; other users' reviews are untouched
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: `Review for ISBN ${isbn} by ${username} deleted successfully`,
      reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
