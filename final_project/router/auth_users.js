const express = require('express');
const jwt = require('jsonwebtoken');
let users = []; // In-memory storage for user data
const books = require('./booksdb.js');

// Function to check if the username is valid (you can implement your validation logic here)
const isValid = (username) => {
  // Implement your username validation logic
  return true;
}

// Function to check if the provided username and password match the stored user data
const authenticatedUser = (username, password) => {
  const user = users.find(u => u.username === username && u.password === password);
  return !!user;
}

const regd_users = express.Router();

// Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the username is already taken
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  // Register the user (for local testing, add the user to the 'users' array)
  users.push({ username, password });
  return res.status(201).json({ message: 'User registered successfully' });
});

// User login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password match the records (you need to implement this logic)
  if (authenticatedUser(username, password)) {
    // Create a JWT token for the user
    const token = jwt.sign({ username }, 'your_secret_key');
    req.session.token = token; // Save the token in the session
    return res.status(200).json({ message: 'Login successful', token });
  } else {
    return res.status(401).json({ message: 'Login failed' });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.token.username; // Retrieve the username from the session token
    const review = req.body.review; // Assuming you send the review data in the request body
  
    if (books[isbn]) {
      // Check if the user has already reviewed this book
      if (!books[isbn].reviews[username]) {
        books[isbn].reviews[username] = review;
      } else {
        // If the user has already reviewed, modify the existing review
        books[isbn].reviews[username] = review;
      }
      return res.status(200).json({ message: 'Review added/modified successfully' });
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  });
  
// Delete a book review based on ISBN
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.token.username; // Retrieve the username from the session token
  
    if (books[isbn]) {
      const reviews = books[isbn].reviews;
  
      // Check if the user has reviewed this book
      if (reviews[username]) {
        // Delete the user's review
        delete reviews[username];
        return res.status(200).json({ message: 'Review deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Review deleted' });
      }
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
