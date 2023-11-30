const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return username.length >= 3 && username.length <= 20 ? true : false;
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // check for username and password filling
  if (!(username && password)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid credentials" });
  }
  // check for username validity before password check
  if (!isValid(username)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "invalid username" });
  }

  const user = users.find((user) => user.username == username);
  const { password: hashedPassword } = user;

  // check for password mismatch
  try {
    const isMatched = await bcrypt.compare(password, hashedPassword);
    if (isMatched) {
      res.status(StatusCodes.OK).json({ msg: "login successful" });
    }
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "invalid username or password" });
  }

  //
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
