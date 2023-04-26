const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let book = books.filter((book) => {
    return book.isbn === isbn;
  });
  if (book.length > 0) {
    return res.status(200).json({ book: book });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let book = books.filter((book) => {
    return book.author === author;
  });
  if (book.length > 0) {
    return res.status(200).json({ book: book });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let book = books.filter((book) => {
    return book.title === title;
  });
  if (book.length > 0) {
    return res.status(200).json({ book: book });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let book = books.filter((book) => {
    return book.isbn === isbn;
  });
  if (book.length > 0) {
    return res.status(200).json({ review: book[0].review });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
