const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: password }, "access", {
        expiresIn: "1h",
      });
      req.session.authorization = { accessToken, username };
      res.status(200).json({ message: "User successfully logged in." });
    } else {
      res.status(404).json({ message: "Invalid username or password." });
    }
  } else {
    res.status(404).json({ message: "Unable to login." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    if (books[isbn][review]) {
      books[isbn][review][username] = req.body.review;
    } else {
      books[isbn][review] = {};
      books[isbn][review][username] = req.body.review;
    }
    return res.status(200).json("Review added successfully.");
  } else {
    return res.status(404).json("Book not found.");
  }
});

// Delete a book review

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization["username"];
  delete books[isbn]["reviews"][user];
  res.send("delete success!");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
