const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Write code to check if the username is valid
  // For example, you can check if the username meets certain criteria
  return username.length >= 3;
};

const authenticatedUser = (username, password) => {
  // Write code to check if the username and password match the records
  // For example, you can compare the provided username and password with the stored values
  return users.some((user) => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username or password is missing" });
  }

  // Check if the username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // Check if the username and password match the records
  if (authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token for authentication
  const token = jwt.sign({ username }, "secretkey");

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  if (books[isbn]) {
    // Check if the reviews object exists
    if (!books[isbn].reviews) {
      books[isbn].reviews = {}; // Initialize the reviews object if it doesn't exist
    }

    // Add the review to the reviews object
    books[isbn].reviews["maher"] = review;

    return res.status(200).json({ message: "Review added successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  
    // Check if the book exists
    if (books[isbn]) {
      // Check if the reviews object exists
      if (books[isbn].reviews) {
        // Check if the user has a review for the book
        if (books[isbn].reviews["maher"]) {
          // Delete the user's review from the reviews object
          delete books[isbn].reviews["maher"];
  
          return res.status(200).json({ message: "Review deleted successfully" });
        } else {
          return res.status(404).json({ message: "Review not found" });
        }
      } else {
        return res.status(404).json({ message: "No reviews found for the book" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
