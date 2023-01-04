const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code herereturn
   res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const { isbn } = req.params;

    let booksArr = Object.entries(books);
  
    let singleBook = booksArr.filter((book) => {
      const [key, value] = book;
      if (key === isbn) {
        return value;
      }
    });
  
    if (singleBook.length < 1) {
      return res.status(400).json({
        success: false,
        msg: `The details for ISBN ${isbn} does not exist`,
      });
    }
  
    return res.status(200).json({ success: true, data: singleBook });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let { author } = req.params;

    author = author
      .split(" ")
      .map((str) => str[0].toUpperCase() + str.slice(1))
      .join(" ");
  
    let values = Object.values(books);
  
    const bookAuthor = values.filter((value) => {
      return value.author.includes(author);
    });
  
    if (bookAuthor.length < 1) {
      return res.status(400).json({
        success: false,
        msg: `The details for author ${author} does not exist`,
      });
    }
    return res.status(200).json({ success: true, data: bookAuthor });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let { title } = req.params;

    title = title
      .split(" ")
      .map((str) => str[0].toUpperCase() + str.slice(1))
      .join(" ");
  
    let values = Object.values(books);
  
    const bookTitle = values.filter((value) => {
      return value.title.includes(title);
    });
  
    if (bookTitle.length < 1) {
      return res.status(400).json({
        success: false,
        msg: `The book with title "${title}" does not exist`,
      });
    }
  
    return res.status(200).json({ success: true, data: bookTitle });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const { isbn } = req.params;
    let booksArr = Object.entries(books);
    let bookReviews = booksArr.filter((book) => {
      const [key, value] = book;
      if (key === isbn) {
        return value.reviews;
      }
    });
    if (bookReviews.length < 1) {
      return res.status(400).json({
        success: false,
        msg: `The reviews for ISBN ${isbn} does not exist`,
      });
    }
    return res.status(200).json({ success: true, data: bookReviews });
});

module.exports.general = public_users;
