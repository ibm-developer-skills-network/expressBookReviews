const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' }
];
const isValid = (username) => {
  // Check if the username exists in the database (replace this with your actual database query)
  const existingUser = users.find(user => user.username === username);
  
  // If the user exists, return true; otherwise, return false
  console.log("Checking if user is valid:", username, "Existing user:", existingUser);
  return !!existingUser;
};


const authenticated = (username, password) => {
  // Find the user by username in the database (replace this with your actual database query)
  const user = users.find(user => user.username === username);

  // If the user doesn't exist or the password doesn't match, return false
  if (!user || user.password !== password) {
      console.log("Authentication failed for user:", username);
      return false;
  }

  // If the username and password match, return true
  return true;
};



// Route for user login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Login request received. Username:", username, "Password:", password);

  if (!username || !password) {
      return res.status(400).json({ message: "Username or password is missing" });
  }

  if (!isValid(username)) {
      console.log("User not found:", username);
      return res.status(404).json({ message: "User not found" });
  }

  if (!authenticated(username, password)) {
      console.log("Invalid username or password:", username);
      return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  const accessToken = jwt.sign({ username }, 'secret', { expiresIn: '1h' });

  console.log("Login successful. Username:", username);
  // Return token and success message to the client
  return res.status(200).json({ message : "Login successful" , accessToken});
});



// Route for adding a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const token = req.headers.authorization;

  // Verify the access token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized. Invalid access token" });
    }

    const { username } = decoded;

    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already reviewed this book
    const existingReview = books[isbn].reviews.find(r => r.username === username);

    if (existingReview) {
      // Modify the existing review
      existingReview.review = review;
      return res.status(200).json({ message: "Review modified successfully" });
    } else {
      // Add a new review
      books[isbn].reviews.push({ username, review });
      return res.status(200).json({ message: "Review added successfully" });
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
