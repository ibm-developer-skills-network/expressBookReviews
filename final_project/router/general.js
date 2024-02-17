const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getAllBooks = () => {
  return books;
};

//registration new user
public_users.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    // Check if username already exists
    if (users.some(user => user.username === username)) {
      throw new Error("Username already exists");
    }

    // Register the new user
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const targetISBN = parseInt(req.params.isbn);
  const targetBook = await books[targetISBN];
  if (!targetBook) {
    return res.status(404).json({ message: "ISBN not found." });
  } else {
    return res.status(200).json(targetBook);
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const booksByAuthor = Object.values(await books).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  if (booksByAuthor.length > 0) {
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res.status(404).json({ message: "No books by that author." });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {  
  const booksWithTitle = Object.values(await books).filter(
    (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
  )[0];
  if (booksWithTitle){
    return res.status(200).json(booksWithTitle);
  } else {
    return res.status(404).json({message: "Title not found"});
  }
});


//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const targetISBN = req.params.isbn;
  const targetBook = books[targetISBN];
  if (targetBook) {
    return res.status(200).send(JSON.stringify(targetBook.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "ISBN not found." });
  }
});

module.exports.general = public_users;
