const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(404).json({message: "Username or Password cannot be empty."});
  }
  if(username && password){
    if(!isValid(username)){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User has been registered."});
    }
    else{
        return res.status(404).json({message: "User already exists"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  //let book = books.find(book => books.isbn === isbn);
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookkeys = Object.keys(books);
  const booksByAuthor = [];
  bookkeys.forEach(key => {
    const book = books[key];
    if(book.author === author){
        booksByAuthor.push(book);
    }
  })
  res.send(JSON.stringify(booksByAuthor, null, 4));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookkeys = Object.keys(books);
  const booksByTitle = [];
  bookkeys.forEach(key =>{
    const book = books[key];
    if(book.title === title){
        booksByTitle.push(book);
    }
  })
  if(booksByTitle.length < 1){
    res.status(404).send("Book not found")
  }
  res.send(JSON.stringify(booksByTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  //console.log("Book is " + book.reviews);
  if(!book){
    res.status(404).json({message: "Book not found"});
  }
  res.send(JSON.stringify(book["reviews"]));
});

module.exports.general = public_users;
