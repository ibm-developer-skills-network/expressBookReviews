const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Customer successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "Customer already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register customer."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    res.send(books[author])
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    res.send(books[title])
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const title = req.params.title;
    res.send(books[title])
});

// Promise callbacks for getting list of books - Task 10
public_users.get('/books',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });
});

// Promise callbacks for getting books by ISBN - Task 11
public_users.get('/books/isbn/:isbn',function (req, res) {
    const get_book_isbn= new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books[isbn], null, 4)));
      });
});

// Promise callbacks for searching by author - Task 12
public_users.get('/books/author/:author',function (req, res) {
    const get_books_author = new Promise((resolve, reject) => {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
      }
    });
    });
});

// Promise callbacks for searching by title - Task 13
public_users.get('/books/title/:title',function (req, res) {
    const get_books_title = new Promise((resolve, reject) => {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
      }
    });
    });
});

module.exports.general = public_users;
