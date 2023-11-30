const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

public_users.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!(username  && password)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all credentials" });
  }

  // check for duplicate
  const existingUser = users.filter((user) => user.username == username);
  if (existingUser.length > 0) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ msg: `the user with username ${username} already exists!!` });
  }
  // hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    username,
    password: hashedPassword,
  };
  users.push(newUser);
  console.log(users);
  return res.status(StatusCodes.CREATED).json({ message: "user succceffully registered" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
