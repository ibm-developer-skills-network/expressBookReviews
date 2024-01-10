const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: "admin",
    password: "admin"
  },
  {
    username: "user1",
    password: "user1"
  },
  {
    username: "user2",
    password: "user2"
  }
];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return users.some((user) => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });

  const username = req.body.username;
  const password = req.body.password;

  if (!username && !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Login successful" });
  }
  else {
    return res.status(401).json({ message: "Invalid credentials" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  const review = req.body.review;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  else {
    book["reviews"][username] = review;
    return res.status(200).json({ message: "Review added successfully" });
  }

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  else {
    delete book["reviews"][username];
    return res.status(200).json({ message: "Review deleted successfully" });
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
