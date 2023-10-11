const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return username.trim() !== '';
}

const authenticateUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!isValid(username) || !password) {
    return res.status(400).json({ message: 'Both username and password are required.' });
  }

  // Check if the username and password match in the user records
  const isUserAuthenticated = authenticateUser(username, password);

  if (!isUserAuthenticated) {
    return res.status(401).json({ message: 'Invalid credentials. Please check your username and password.' });
  }

  // Create a JWT token for the authenticated user
  const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });

  return res.status(200).json({ message: 'Login successful.', token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;

  // Check if review and ISBN are provided
  if (!review || !isbn) {
    return res.status(400).json({ message: 'Both review and ISBN are required.' });
  }

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  // Check if the book already has reviews
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // If the user has already reviewed this book, update the review
  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: 'Review modified successfully.' });
  }

  // Add the review for the book
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: 'Review added successfully.' });
});
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;
  
    // Check if ISBN is provided
    if (!isbn) {
      return res.status(400).json({ message: 'ISBN is required.' });
    }
  
    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found.' });
    }
  
    // Check if the book has reviews
    if (!books[isbn].reviews) {
      return res.status(404).json({ message: 'No reviews found for this book.' });
    }
  
    // Check if the user has a review for this book
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: 'No review found for this user and book.' });
    }
  
    // Delete the user's review for this book
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: 'Review deleted successfully.' });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
