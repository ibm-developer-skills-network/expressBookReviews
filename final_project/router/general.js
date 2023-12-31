const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

function fetchBooks() {
  return new Promise((resolve) => {
    // Simulating an asynchronous operation
    setTimeout(() => {
      resolve(books);
    }, 1000); // Simulating a delay of 1 second
  });
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  fetchBooks()
    .then((books) => {
      // Successful promise resolution
      return res.status(200).send(JSON.stringify(books, null, 4));
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching books:", error);
      return res.status(500).send("Internal Server Error");
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  fetchBooks()
    .then((books) => {
      // Successful promise resolution
      return res.status(200).send(JSON.stringify(books[isbn]));
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching books:", error);
      return res.status(500).send("Internal Server Error");
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  fetchBooks()
    .then((books) => {
      // Successful promise resolution
      const booksList = Object.values(books);
      const filteredBooks = booksList.filter((book) => book.author === author);
      return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching books:", error);
      return res.status(500).send("Internal Server Error");
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  fetchBooks()
    .then((books) => {
      // Successful promise resolution
      const booksList = Object.values(books);
      const filteredBooks = booksList.filter((book) => book.title === title);
      return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching books:", error);
      return res.status(500).send("Internal Server Error");
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
