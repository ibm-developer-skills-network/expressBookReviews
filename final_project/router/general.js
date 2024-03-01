const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;

  if (!userName || !password) {
    return res.status(400).json({
      message:
        "Unable to register user because username &/ password were not provided correctly.",
    });
  }

  if (!isValid(userName)) {
    return res.status(400).json({ message: "The username already exists!" });
  }

  users.push({ username: userName, password: password });
  console.log("users: ", users);
  return res
    .status(200)
    .json({ message: "User successfully registred. Now you can login" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const books = await getAllBooks();
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error when trying to get the book list available." });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = getBookByISBN(isbn);

  book
    .then((bookDetail) => {
      return res.status(200).send(JSON.stringify(bookDetail, null, 4));
    })
    .catch((error) => {
      console.error(error);
      return res.status(400).send(`Book with isbn ${isbn} not found.`);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  if (!author) {
    return res.status(400).json({ message: "Author not provided." });
  }

  for (const [isbn, bookDetails] of Object.entries(books)) {
    if (bookDetails.author === author) {
      const { title, reviews } = bookDetails;
      booksByAuthor.push({ isbn, title, reviews });
    }
  }

  return res
    .status(200)
    .send(JSON.stringify({ booksbyauthor: booksByAuthor }, null, 4));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const bookTitle = req.params.title;
  const booksByTitle = [];

  if (!bookTitle) {
    return res.status(400).json({ message: "Title not provided." });
  }

  for (const [isbn, bookDetails] of Object.entries(books)) {
    const { author, reviews } = bookDetails;
    if (bookDetails.title === bookTitle) {
      booksByTitle.push({ isbn, author, reviews });
    }
  }

  return res
    .status(200)
    .send(JSON.stringify({ booksbytitle: booksByTitle }, null, 4));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({ message: "isbn not provided!" });
  }

  const bookReview = books[isbn].reviews;
  return res.status(200).send(JSON.stringify(bookReview, null, 4));
});

/* ----- Promise callbacks ----- */

const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      books ? resolve(books) : reject(new Error("Error getting all books."));
    }, 1000);
  });
};

function getBookByISBN(ISBN) {
  const result = new Promise((resolve, reject) => {
    setTimeout(() => {
      books[ISBN]
        ? resolve(books[ISBN])
        : reject(new Error(`Book with isbn ${ISBN} not found.`));
    }, 1000);
  });

  return result;
}

module.exports.general = public_users;
