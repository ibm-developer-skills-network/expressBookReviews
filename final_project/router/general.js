const express = require("express");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const { StatusCodes } = require("http-status-codes");
const books = require("./booksdb.js");
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all credentials" });
  }

  if (!isValid(username)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "username invalid" });
  }

  // check for duplicate
  const doesExist = users.some((user) => user.username == username);
  if (doesExist) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ msg: `the user with username ${username} already exists!!` });
  }
  const newUser = {
    username,
    password,
  };
  users.push(newUser);
  console.log(users);
  return res
    .status(StatusCodes.CREATED)
    .json({ message: "user succceffully registered" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    return res.status(StatusCodes.OK).json({ books });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const { isbn } = req.params;
  try {
    const book = await getBooksByISBN(isbn);
    res.status(StatusCodes.OK).json(book);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const { author } = req.params;
  try {
    const book = await getBooksByAuthor(author);
    res.status(StatusCodes.OK).json(book);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const { title } = req.params;
  try {
    const book = await getBooksByTitle(title);
    res.status(StatusCodes.OK).json(book);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `book with ISBN ${isbn} not found` });
  } else {
    return res.status(StatusCodes.OK).json({ reviews: book.reviews });
  }
});



const getBooksByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve({ book });
    } else {
      reject({ msg: `book with ISBN ${isbn} not found` });
    }
  });
};

const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(
      (book) => book.title == title
    );
    if (filteredBooks.length > 0) {
      resolve({ books: filteredBooks });
    } else {
      reject({ msg: `no book found for title ${title}` });
    }
  });
};

const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(
      (book) => book.author == author
    );
    if (filteredBooks.length > 0) {
      resolve({ books: filteredBooks });
    } else {
      reject({ msg: `no book found for author ${author}` });
    }
  });
};
module.exports.general = public_users;
