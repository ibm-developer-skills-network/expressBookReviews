const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const userInfo = users.filter((user) => {
    return user.username === username;
  });

  return userInfo.length > 0 ? false : true;
};

const authenticatedUser = (username, password) => {
  //write code to check if username and password match the one we have in records.
  const validUser = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  return validUser.length > 0 ? true : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Error logging in, username &/ password were not provided.",
    });
  }

  if (!authenticatedUser(username, password)) {
    return res
      .status(401)
      .json({ message: "Invalid Login. Check username and password" });
  }

  const accessToken = jwt.sign(
    {
      data: password,
    },
    "access",
    { expiresIn: 60 * 60 }
  );
  req.session.authorization = {
    accessToken,
    username,
  };
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.query;
  const username = req.session.authorization.username;
  const book = books[isbn];

  if (!isbn || !review || !username) {
    return res.status(400).json({
      message:
        "Error when adding a book review, make sure to provide the isbn and review correctly.",
    });
  }

  if (!book) {
    return res.status(400).json({
      message:
        "Book not found, make sure the isbn provided is correct and try again.",
    });
  }

  book.reviews[username] = review;
  return res.status(200).send(JSON.stringify(book, null, 4));
});

// Delete a book review based on the logged in user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!isbn || !books[isbn]) {
    res.status(400).json({
      message:
        "Error finding book details by isbn, provide a correct/valid isbn.",
    });
  }

  delete books[isbn].reviews[username];
  res.status(200).json({
    message: `Book review made by ${username} was successfully deleted.`,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
