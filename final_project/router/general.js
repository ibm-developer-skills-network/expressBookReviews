const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});
const getAllBooks = Promise.resolve(JSON.stringify ({"books": books}));
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getAllBooks.then(result=> res.send(result))
  .catch(err => res.status(500).send(err))
 // res.send(JSON.stringify ({"books": books}));
});
const bookByIsbn = (isbn) => Promise.resolve(books[isbn]);
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    bookByIsbn(isbn).then(result => res.send(result))
    .catch(err => res.status(500).send(err));
  //  res.send(books[isbn]);
 });
  
 const booksByAuthor =(author)=>{
  const theAuthor = author;
  let filtered_books = {};
    return new Promise((resolve, reject )=>{
      for (var key in books){
        if(books[key].author === theAuthor){
          filtered_books[key] = books[key];
        }
      }
      resolve({"booksbyauthor":filtered_books})

    })
 }
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
 // Write your code here
   const theAuthor = req.params.author;
  // let filtered_books = {};
  // for (var key in books){
  //   if(books[key].author === theAuthor){
  //     filtered_books[key] = books[key];
  //   }

  // }
  //   res.send({"booksbyauthor":filtered_books});
  booksByAuthor(theAuthor).then(result => res.send(result))
    .catch(err => res.status(500).send(err));


});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const theTitle = req.params.title;
  let filtered_books = {};
  for (var key in books){
    if(books[key].title === theTitle){
        filtered_books[key] = books[key];
    }

  }
    res.send({"booksbytitle":filtered_books});

  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;