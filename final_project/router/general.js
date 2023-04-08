const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ Message: "Something is error. Try again" });
  }

  if (isValid(username)) {
    return res
      .status(403)
      .json({ Message: "Username have already been created." });
  }

  const user = { username, password };
  users.push(user);

  return res.status(200).json({ Message: "Register success" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ Message: "Book not found" });
  }
  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  if (!author) {
    return res.status(404).json({ Message: "Not found" });
  }
  const filterBook = {};
  for (const book in books) {
    if (books[book].author === author) {
      filterBook[book] = books[book];
    }
  }

  return res.status(200).json(filterBook);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  if (!title) {
    return res.status(404).json({ Message: "Not found" });
  }
  const filterBook = {};
  for (const book in books) {
    if (books[book].title === title) {
      filterBook[book] = books[book];
    }
  }

  return res.status(200).json(filterBook);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).json({ Message: "ISBN not found" });
  }
  const review = books[isbn].review;

  return res.status(200).json(review);
});

module.exports.general = public_users;
