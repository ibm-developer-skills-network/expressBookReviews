const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const user = users.find((user) => user.username === username);
  return user ? true : false;
};

const authenticatedUser = (username, password) => {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user ? true : false;
};

// only registered users can login
regd_users.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(403).json({ Message: "Try again!" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ Message: "Username or Password is wrong" });
  }

  const accessToken = await jwt.sign(
    { username },
    process.env.SECRET_ACCESS_TOKEN,
    {
      expiresIn: "1h",
    }
  );
  req.session.authorization = { accessToken };
  // req.user = { username };
  return res.status(200).json({ message: "Login success" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const isbn = req.params.isbn;
  if (!review || !isbn) {
    return res.status(404).json({ Message: "Try again" });
  }

  books[isbn].reviews[req.user.username] = review;
  return res.status(200).json(books);
});

// Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!isbn) {
    return res.status(404).json({ Message: "Not found" });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
  }

  return res.status(200).json(books);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
