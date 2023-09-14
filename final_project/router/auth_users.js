const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const validUsers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const { username } = req.session.authorization;
  const book = books[isbn];
  if (book) {
    const reviews = book.reviews;
    reviews[username] = review;
  }
  //KISS, using the same response message for all cases
  res.send(`Review of book (ISBN ${isbn}) updated.`);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req,res) =>{
  const isbn = req.params.isbn;
  const {username} = req.session.authorization;
  const book = books[isbn];
  if (book) {
    const reviews = book.reviews;
    delete reviews[username];
  }
  //KISS, using the same response message for KISS
  res.send(`Review of book (ISBN ${isbn}) deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
