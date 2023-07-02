const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: "user1",
    password: "password1"
  },
  {
    username: "user2",
    password: "password2"
  },
  {
    username: "user3",
    password: "password3"
  }
];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let valid = true;
  users.forEach(user => {
    if (user.username == username) {
      valid = false;
    }
  });
  return valid;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let match = false;
  users.forEach(user => {
    if (user.username == username && user.password == password) {
      match = true;
    }
  });
  return match;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  if (req.body.username && req.body.password) {

    username = req.body.username;
    password = req.body.password;

    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });

      req.session.authorization = {
        accessToken, username
      }
      return res.status(200).send("Review for book with ISBN 1 has been updated");
    }
    else {
      return res.status(401).json({ message: "Review successfully posted" });
    }
  }
  else {
    return res.status(401).json({ message: "Information missing" });
  }

});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
  if (books[req.params.isbn]) {
    books[req.params.isbn].reviews[username] = req.body.review;
    return res.status(200).send("Review successfully posted.");
  }
  else {
    return res.status(404).json({ message: `ISBN ${req.params.isbn} not found` });
  }
});

// Delete  a book review
regd_users.delete("/auth/delete/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
  if (books[req.params.isbn]) {
    delete books[req.params.isbn].reviews[username];
    return res.status(200).send("Review successfully deleted.");
  }
  else {
    return res.status(404).json({ message: `ISBN ${req.params.isbn} not found` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
