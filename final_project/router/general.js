const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksWithAuthor = {};
    for (let isbn = 1; isbn <= Object.keys(books).length; isbn++) {
        let currBook = books[isbn];
        if (currBook.author === author) {
            booksWithAuthor[isbn] = currBook;
        }
    }
    res.send(JSON.stringify(booksWithAuthor, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksWithTitle = {};
    for (let isbn = 1; isbn <= Object.keys(books).length; isbn++) {
        let currBook = books[isbn];
        if (currBook.title === title) {
            booksWithTitle[isbn] = currBook;
        }
    }
    res.send(JSON.stringify(booksWithTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    res.send(`Reviews for ${book.title} by ${book.author}: ${JSON.stringify(books[isbn].reviews, null, 4)}`);
});

module.exports.general = public_users;
