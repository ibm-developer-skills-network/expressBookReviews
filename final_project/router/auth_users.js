const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  return !!users.find((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find((user) => user.username === username);

  if (!isValid(username)) return false;
  if (user.password !== password) return false;
  return true;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  try {
    if (!authenticatedUser(username, password))
      return res.status(401).json({ massage: "Unauthenticated" });

    const token = jwt.sign({ username }, "process.env.SECREAT", {
      expiresIn: 60 * 60,
    });

    req.session.token = token;
    return res.status(300).json({ message: "login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "unable to authenticate user" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) return res.status(400).json({ massage: "missing review field" });

  try {
    books[isbn].reviews[req.user.username] = review;
    return res.status(300).json(books[isbn]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ massage: "unable to create review" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  try {
    delete books[isbn].reviews[req.user.username];
    return res.status(300).json(books[isbn]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ massage: "unable to create review" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
