const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require("express-session");

let users = [];

const isValid = (username) => {};

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

const app = express();

app.use(
  session({ secret: "fingerpint" }, (resave = true), (saveUninitialized = true))
);

app.use(express.json());

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      req.session.user = username;

      return res.status(200).json({ message: "User successfully logged in" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }
  return res.status(404).json({ message: "Unable to login user." });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
