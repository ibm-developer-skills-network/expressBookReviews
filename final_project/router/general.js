const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
  const username = req.query.username;
  const password = req.query.password;

  if(username && password) {
    if(!isValid(username)) {
      users.push({
        "username": username, 
        "password": password
      });
      return res.status(200).json({message: "User added successfully"});
    }
    return res.status(200).json({message: "User already exist"});
  } else {
    return res.status(200).json({message: "username &/ password not provided"});
  }

});

// Get the book list available in the shop
public_users.get('/', (req, res) => {

  if(Object.keys(books).length > 0) {
    return res.status(200).json({message: "success", books: JSON.stringify(books)});
  } else {
    return res.status(200).json({message: "Oups sorry buddy! No book present in library", books: books, });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(!isbn) {
    return res.status(400).json({message: "Bad request: please provide an isbn"});
  }
  const booksByIsbn = Object.values(books).filter(book => book.isbn === isbn);
  return res.status(200).json({message: "success", books: booksByIsbn});
 });


  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  if(!author) {
    return res.status(400).json({message: "Bad request: please provide an isbn"});
  }
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  return res.status(200).json({message: "success", books: booksByAuthor});
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  
  if(!title) {
    return res.status(400).json({message: "Bad request: please provide a title"});
  }
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  return res.status(200).json({message: "success", books: booksByTitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(!isbn) {
    return res.status(400).json({message: "Bad request: please provide an isbn"});
  }

  const bookReviewByIsbn = Object.values(books).filter(book => book.isbn === isbn);

  return res.status(200).json({message: "success", books: bookReviewByIsbn});

});

module.exports.general = public_users;
