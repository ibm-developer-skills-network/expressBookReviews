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
  return jwt.sign({ username: user.username }, TOKEN_KEY, {
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
    let sessionData = { username, accessToken };
    req.session.authorization = sessionData;
    res.status(StatusCodes.OK).json({
      msg: "successfully logged in ",
      username,
      accessToken,
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
  const { username } = req.session.authorization;
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `book with ISBN ${isbn} not found` });
  } else {
    // use 'reviews' keyword in the body while making a request
    const { reviews } = req.body;
    if (!reviews) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "please provide  reviews" });
    }
    book.reviews[username] = reviews;
    res
      .status(StatusCodes.CREATED)
      .json({ msg: `review added successfully for user ${username}`, book });
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.session.authorization;
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `book with ISBN ${isbn} not found` });
  } else {
    const review = book.reviews[username];
    console.log(review);
    if (review) {
      delete book.reviews[username];
      return res
        .status(StatusCodes.OK)
        .json({
          msg: `review deleted successfully for user ${username}`,
          book,
        });
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "no reviews found" });
    }
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
