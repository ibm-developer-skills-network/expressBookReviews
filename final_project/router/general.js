const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function doesExist(username) {
  let userswithsameusername = users.filter((user) => user.username === username);
  if(userswithsameusername.leghth > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if(!doesExist(username)) {
    users.push({"username":username, "password":password});
    return res.status(200).json({message: "USer successfully registered! You may now login."})
  } 
  else {
    return res.status(404).json({message: "User already exists!"});
  }
});

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
  //Write your code here
  let books = req.params.books;
  let bookPromise = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 4));
    reject("Unable to parse book list. Try again later.")
  });
  bookPromise.then((bookList) => {
    res.send(bookList);
  })
});

// Get book details based on ISBN
public_users.get('/books/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let bookPromise = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books[isbn], null, 4));
    reject(`Unable to find book with ISBN: ${isbn}`);
  })
  //Write your code here
  bookPromise.then((isbnList) => {
    res.send(isbnList);
  })
 });
  
 function authorList(author) {
  let keys = Object.keys(books);
  let filteredBooks = [];
  for (let i=0; i<keys.length; i++) {
    let book = books[keys[i]];
    if(book.author === author) {
      filteredBooks.push(book)
    }
  }
  if (filteredBooks.length > 0) {
    return(JSON.stringify(filteredBooks, null, 4));
  }
  else {
    return(`No books found by this ${author}.`)
 }
}
// Get book details based on author
public_users.get('/books/author/:author',function (req, res) {
  //Write your code here
  let authorList = req.params.author
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let keys = Object.keys(books);
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
