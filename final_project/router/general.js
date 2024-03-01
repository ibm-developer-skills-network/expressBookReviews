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
  const authorName = req.params.author;
  const books = getBookBy("author", authorName);

  books
    .then((bookData) => {
      return res
        .status(200)
        .send(JSON.stringify({ booksbyauthor: bookData }, null, 4));
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error getting books by author." });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const bookTitle = req.params.title;
  const books = getBookBy("title", bookTitle);

  books
    .then((bookData) => {
      return res
        .status(200)
        .send(JSON.stringify({ booksbytitle: bookData }, null, 4));
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: "Error getting books by title." });
    });
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

function getBookBy(param, value) {
  function fieldsByParam(data, param) {
    const { author, title, reviews } = data;
    switch (param) {
      case "author":
        return { title, reviews };
      case "title":
        return { author, reviews };
      default:
        return { author, title, reviews };
    }
  }

  const result = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!books) {
        reject(new Error(`Error when trying to get books by ${param}.`));
      }

      const booksFound = [];
      for (const [isbn, bookDetails] of Object.entries(books)) {
        if (bookDetails[param] === value) {
          booksFound.push({ isbn, ...fieldsByParam(bookDetails, param) });
        }
      }
      resolve(booksFound);
    }, 1000);
  });

  return result;
}

module.exports.general = public_users;
