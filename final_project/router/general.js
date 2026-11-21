const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (isValid(username))
      return res.status(400).json({ massage: "username alread exist" });

    if (!username || !password)
      return res.status(400).json({
        message: "must  provied required username and password fields",
      });

    users.push({ username, password });

    res.status(200).json({ massage: "user successfully registred" });
  } catch (error) {
    res.status(500).json({ massage: "unable to register user" });
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const data = await new Promise((resolve, _) => resolve(books));
    res.status(300).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ massage: "unable to fetch all books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;

    if (!isbn)
      return res
        .status(404)
        .json({ message: `Book with ISBN:${isbn} not found` });

    const bookByISBN = await new Promise((resolve, _) => resolve(books[isbn]));
    res.status(300).json(bookByISBN);
  } catch (error) {
    res.status(500).json({ message: `Unable to retrive book with isbn` });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author.split("-").join(" ");
  let isBook;

  try {
    isBook = await new Promise((resolve, _) => {
      for (const book in books) {
        if (books[book].author.toLowerCase() === author.toLowerCase()) {
          resolve(books[book]);
        }
      }
    });
    res.status(300).json(isBook);
  } catch (error) {
    res.status(500).json({ massage: "unable to get book by author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title.split("-").join(" ");
  let isBook;

  try {
    for (const book in books) {
      if (books[book].title.toLowerCase() === title.toLowerCase()) {
        isBook = books[book];
      }
    }
    return res.status(300).json(isBook);
  } catch (error) {
    res.status(500).json({ massage: "unable to get book by title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  let reviews;

  try {
    for (const book in books) {
      if (book === isbn) {
        reviews = books[book].reviews;
      }
    }
    return res.status(300).json(reviews);
  } catch (error) {
    res.status(500).json({ massage: "unable to get book reviews" });
  }
});

module.exports.general = public_users;
