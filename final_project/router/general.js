const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a user
public_users.post("/register", (req, res) => {
  // Gather credentials from request body.
  const username = req.body.username;
  const password = req.body.password;

  // First, check if there exists a value for the username and password.
  if (username.length > 0 && password.length > 0) {
    // Next, check if the username already exists in our system.
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered!" });
    } else {
      return res.status(406).json({ message: "Unable to register user: User already exists!" });
    }
  }
  return res.status(406).json({ message: "Unable to register user: No username and/or password provided." });
});

// Task 1: Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify({ books }, null, 4));
});

// Task 10: Implementing a promise to getting the available books in the shop
public_users.get("/async", function (req, res) {
  const getBooks = new Promise(() => {
    res.send(JSON.stringify({ books }));
  });

  getBooks.then(() => console.log("Promise for Task 10 is now resolved."))
});

// Task 2: Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;
  res.send(books[bookISBN]);
});

// Task 11: Implement a promise for getting book details based on ISBN
public_users.get("/async/isbn/:isbn", function (req, res) {
  // Promise to get the book.
  const getBook = new Promise(() => {
    const bookISBN = req.params.isbn;
    res.send(books[bookISBN]);
  });

  getBook.then(() => console.log("Promise for Task 11 is now resolved."))
});

// Task 3: Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  // Get all keys.
  const allBooksByAuthor = Object.entries(books);
  const finalBooks = [];

  // Find which values match the given author.
  for (const [key, value] of allBooksByAuthor) {
    if (value.author === author) {
      finalBooks.push(value);
    }
  }
  res.send(finalBooks);
});

// Task 12: Implement a promise to get book details based on author
public_users.get("/async/author/:author", function (req, res) {
  const getAuthorsBooks = new Promise(() => {
    const author = req.params.author;
  
    // Get all keys.
    const allBooksByAuthor = Object.entries(books);
    const finalBooks = [];
  
    // Find which values match the given author.
    for (const [key, value] of allBooksByAuthor) {
      if (value.author === author) {
        finalBooks.push(value);
      }
    }
    res.send(finalBooks);
  })

  getAuthorsBooks.then(() => console.log("Promise for Task 12 is now resolved."))
});

// Task 4: Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  // Get all keys.
  const allBooksByTitle = Object.entries(books);
  const finalBooks = [];

  // Find which values match the given title.
  for (const [key, value] of allBooksByTitle) {
    if (value.title === title) {
      finalBooks.push(value);
    }
  }
  res.send(finalBooks);
});

// Task 13: Implement a promise get all books based on title
public_users.get("/async/title/:title", function (req, res) {
  const getBookTitles = new Promise(() => {
    const title = req.params.title;
  
    // Get all keys.
    const allBooksByTitle = Object.entries(books);
    const finalBooks = [];
  
    // Find which values match the given title.
    for (const [key, value] of allBooksByTitle) {
      if (value.title === title) {
        finalBooks.push(value);
      }
    }
    res.send(finalBooks);
  });

  getBookTitles.then(() => console.log("Promise for Task 13 is now resolved."))
});

// Task 5: Get book review
public_users.get("/review/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;
  // Get the book reviews for the given ISBN.
  const book = books[bookISBN];

  res.send(book.reviews);
});

module.exports.general = public_users;