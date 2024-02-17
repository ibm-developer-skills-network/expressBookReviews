const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
regd_users.use(express.json());

let users = [];

//returns boolean
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

//returns boolean
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// /customer/login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  } else if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Incorrect username or password" });
  } else {
    const accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User successfully logged in." });
  }
});

// Add a book review
// /customer/auth/:isbn
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const review = req.body.review; // string
  const isbn = req.params.isbn;
  if (!review) {
    res.status(400).json({ message: "Review is empty!" });
  } else {
    books[isbn].reviews[user] = review;
    res.status(200).json({ message: "Book review updated." });
  }
});

// delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    res.status(400).json({ message: "invalid ISBN." });
  } else if (!books[isbn].reviews[user]) {
    res
      .status(400)
      .json({ message: `${user} hasn't submitted a review for this book.` });
  } else {
    delete books[isbn].reviews[user];
    res.status(200).json({ message: "Book review deleted." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;