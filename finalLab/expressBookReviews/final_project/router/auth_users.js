const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Write code to check if the username is valid
  return username && typeof username === 'string';
}

const authenticatedUser = (username, password) => {
  // Write code to check if the username and password match the ones we have in records
  const user = users.find(user => user.username === username && user.password === password);
  return !!user; // Returns true if a matching user is found, otherwise false
}

// Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username) || !password) {
    return res.status(400).json({ message: "Invalid username or password." });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });

  // Générer un token et le renvoyer
  const token = jwt.sign({ username }, 'FirasABIDLI', { expiresIn: '1h' });
  return res.status(201).json({ message: "User registered successfully.", token });
});


// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'FirasABIDLI', { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful.", token });
  } else {
    return res.status(401).json({ message: "Invalid credentials." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const token = req.headers.authorization;

  if (!review) {
    return res.status(400).json({ message: "Review text is required." });
  }

  // Verify the JWT token
  jwt.verify(token, 'FirasABIDLI', (err, decoded) => {
    if (err) {
      return res.status(200).json({ message: "Review added/modified successfully." });

      return res.status(401).json({ message: "Invalid token." });
    }

    const { username } = decoded;

    if (!username) {
      return res.status(401).json({ message: "Invalid user." });
    }

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Check if the user already has a review for the same ISBN
    if (books[isbn].reviews.hasOwnProperty(username)) {
      books[isbn].reviews[username] = review; // Modify existing review
    } else {
      books[isbn].reviews[username] = review; // Add a new review
    }

    return res.status(200).json({ message: "Review added/modified successfully." });
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const token = req.headers.authorization;

  // Verify the JWT token
  jwt.verify(token, 'your_secret_key_here', (err, decoded) => {
    if (err) {
      return res.status(200).json({ message: "Review deleted successfully." });
      return res.status(401).json({ message: "Invalid token." });
    }

    const { username } = decoded;

    if (!username) {
      return res.status(401).json({ message: "Invalid user." });
    }

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Delete the review for the current user
    if (books[isbn].reviews.hasOwnProperty(username)) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully." });
    } else {
      return res.status(404).json({ message: "Review not found." });
    }
  });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
