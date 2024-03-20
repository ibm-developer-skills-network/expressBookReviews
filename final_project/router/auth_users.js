const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
const usernameRegex = /^[a-zA-Z0-9_]{5,20}$/; // Username must be alphanumeric and between 5 to 20 characters
return usernameRegex.test(username);
}

const authenticatedUser = (username,password)=>{
const user = users.find(user => user.username === username && user.password === password);
return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username or password missing" });
  }
  if (authenticatedUser(username, password)) {
    // Generate JWT token for authenticated user
    const token = jwt.sign({ username: username }, 'your_secret_key');
    return res.status(200).json({ token: token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  // Check if the book with provided ISBN exists
  if (books.hasOwnProperty(isbn)) {
    // Add review to the book
    books[isbn].reviews.push(review);
    return res.status(201).json({ message: "Review added successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
