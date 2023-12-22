const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
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

const fetchBooks = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
};

public_users.get("/", function (req, res) {
  fetchBooks()
    .then((bookList) => {
      res.status(200).json({ books: bookList });
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Get book details based on ISBN
const fetchBookDetails = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject({ message: "Book not found" });
      }
    }, 1000);
  });
};

public_users.get("/isbn/:isbn", function (req, res) {
  const requestedIsbn = req.params.isbn;

  // Use promises to fetch book details
  fetchBookDetails(requestedIsbn)
    .then((bookDetails) => {
      res.status(200).json({ book: bookDetails });
    })
    .catch((error) => {
      console.error("Error fetching book details:", error);
      res.status(404).json({ message: "Book not found" });
    });
});

// Get book details based on author
const fetchBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchingBooks = [];

      for (const isbn in books) {
        if (books.hasOwnProperty(isbn)) {
          const book = books[isbn];
          if (book.author === author) {
            matchingBooks.push({ isbn, ...book });
          }
        }
      }

      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject({ message: "Books by the author not found" });
      }
    }, 1000);
  });
};

public_users.get("/author/:author", function (req, res) {
  const requestedAuthor = req.params.author;

  // Use promises to fetch books by author
  fetchBooksByAuthor(requestedAuthor)
    .then((matchingBooks) => {
      res.status(200).json({ books: matchingBooks });
    })
    .catch((error) => {
      console.error("Error fetching books by author:", error);
      res.status(404).json({ message: "Books by the author not found" });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const requestedTitle = req.params.title;
  const matchingBooks = [];

  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.title.toLowerCase() === requestedTitle.toLowerCase()) {
        matchingBooks.push({ isbn, ...book });
      }
    }
  }
  if (matchingBooks.length > 0) {
    res.status(200).json({ books: matchingBooks });
  } else {
    res.status(404).json({ message: "Books with the title not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const requestedIsbn = req.params.isbn;

  if (books.hasOwnProperty(requestedIsbn)) {
    const bookReviews = books[requestedIsbn].reviews;

    if (Object.keys(bookReviews).length > 0) {
      res.status(200).json({ reviews: bookReviews });
    } else {
      res.status(404).json({ message: "No reviews available for the book" });
    }
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
