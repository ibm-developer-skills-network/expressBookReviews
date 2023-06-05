const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    res.status(409).json({ message: "Username already exists" });
  } else {
    const newUser = { username, password };
    users.push(newUser);
    res.status(201).json({ message: "User registered successfully" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return new Promise((resolve, reject) => {
    resolve({ books });
  })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Failed to retrieve books" });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbnData = req.params.isbn;

  if (!isbnData) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  return new Promise((resolve, reject) => {
    const book = Object.values(books).find((item) => item.isbn === isbnData);
    if (book) {
      resolve(book);
    } else {
      reject({ message: "Book not found" });
    }
  })
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: "Book not found" });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const authorName = req.params.author;

  return new Promise((resolve, reject) => {
    const filtredAuthor = Object.values(books).filter(
      (item) => item.author === authorName
    );
    if (filtredAuthor.length > 0) {
      resolve(filtredAuthor);
    } else {
      reject({ message: "Author not found" });
    }
  })
    .then((filtredAuthor) => {
      return res.status(200).json({ filtredAuthor });
    })
    .catch((error) => {
      return res.status(404).json({ message: "Author not found" });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  return new Promise((resolve, reject) => {
    const filtredTitle = Object.values(books).filter(
      (item) => item.title === title
    );
    if (filtredTitle.length > 0) {
      resolve(filtredTitle);
    } else {
      reject({ message: "Title not found" });
    }
  })
    .then((filtredTitle) => {
      return res.status(200).json({ filtredTitle });
    })
    .catch((error) => {
      return res.status(404).json({ message: "Title not found" });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  const book = books.find((item) => item.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const reviews = book.reviews;
  return res.status(200).json({ reviews });
});

module.exports.general = public_users;
