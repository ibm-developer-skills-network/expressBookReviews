const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { TOKEN_KEY } = process.env;
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return username.length >= 3 && username.length <= 20 ? true : false;
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  let validUsers = users.filter(
    (user) => user.username == username && user.password == password
  );
  return validUsers.length > 0 ? true : false;
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

const generateAccessToken = (user) => {
  return jwt.sign({ data: user.password }, TOKEN_KEY, {
    expiresIn: 60 * 60,
  });
};

//only registered users can login
regd_users.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // check for username and password filling
  if (!(username && password)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "please provide all credentials" });
  }
  if (authenticatedUser(username, password)) {
    const user = users.find((user) => user.username == username);
    let accessToken = generateAccessToken(user);
    let sessionData = {username, accessToken};
    req.session.authorization = sessionData;
    res.status(StatusCodes.OK).json({
      msg: "successfully logged in ",
      username, 
      accessToken

    });
  }
  // check for password
  else {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "invalid username or password" });
  }
  //
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
