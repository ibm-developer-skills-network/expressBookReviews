const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

public_users.get("/async", function (req, res) {
    const promiseBooks = new Promise(() => {
        res.send(JSON.stringify({ books }));
    });
    promiseBooks.then(() => console.log("Promise has been resolved."))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });

public_users.get("/async/isbn/:isbn", function (req, res) {
    const promiseBooks = new Promise(() => {
        const isbn = req.params.isbn;
        res.send(books[isbn])
    });
    promiseBooks.then(() => console.log("Promise has been resolved."))
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  const allBooks = Object.entries(books);
  const bookReturn = [];

  for (const [key, value] of allBooks) {
    if (value.author === authorName) {
      bookReturn.push(value);
    }
  }
  res.send(bookReturn);
});

public_users.get("/async/author/:author", function (req, res) {
    const promiseBooks = new Promise(() => {
        const authorName = req.params.author;
        const allBooks = Object.entries(books);
        const bookReturn = [];

        for (const [key, value] of allBooks) {
            if (value.author === authorName) {
                bookReturn.push(value);
            }
        }
        res.send(bookReturn);
    });
    promiseBooks.then(() => console.log("Promise has been resolved."))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const bookTitle = req.params.title;
    const allBooks = Object.entries(books);
    const bookReturn = [];
  
    for (const [key, value] of allBooks) {
      if (value.title === bookTitle) {
        bookReturn.push(value);
      }
    }
    res.send(bookReturn);
});

public_users.get("/async/title/:title", function (req, res) {
    const promiseBooks = new Promise(() => {
        const bookTitle = req.params.title;
        const allBooks = Object.entries(books);
        const bookReturn = [];
  
        for (const [key, value] of allBooks) {
            if (value.title === bookTitle) {
                bookReturn.push(value);
            }
        }
        res.send(bookReturn);
    });
    promiseBooks.then(() => console.log("Promise has been resolved."))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const rBook = books[isbn];
    res.send(rBook.reviews);
});

module.exports.general = public_users;
