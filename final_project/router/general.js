const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  //Write your code here
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4))
  return res.status(300);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  console.log(isbn)
  const bookDetails = books[isbn];
  //Write your code here
  return res.status(300).json(bookDetails);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const booksByAuthor = Object.values(books).filter((book) => {
    return book.author === req.params.author;
  });

  // Check if any books were found for the given author
  if (booksByAuthor.length === 0) {
    return res.status(404).json({ error: 'Books by the author not found' });
  }

  // If books are found, return the details in the response
  res.json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const booksBytitle = Object.values(books).filter((book) => {
    return book.title === req.params.title;
  });

  // Check if any books were found for the given author
  if (booksBytitle.length === 0) {
    return res.status(404).json({ error: 'Books by the title not found' });
  }

  // If books are found, return the details in the response
  //Write your code here
  return res.status(300).json(booksBytitle);

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const bookDetails = books[isbn];
  return res.status(300).json(bookDetails.reviews);

});

//Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
let myPromise = new Promise((resolve,reject) => {
  setTimeout(() => {
    resolve("Promise resolved")
  },6000)})

myPromise.then((successMessage) => {
  console.log("From Callback " ,{books} )
})

let myPromise2 = new Promise((resolve,reject) => {
  setTimeout(() => {
    //passing 1 as parameter
    resolve(1)
  },6000)})

myPromise2.then((successMessage) => {

  console.log(books[successMessage])
})

let myPromise3 = new Promise((resolve,reject) => {
  setTimeout(() => {
    //passing author name as parameter
    resolve("Hans Christian Andersen")
  },6000)})

myPromise3.then((successMessage) => {
  const booksByAuthor = Object.values(books).filter((book) => {
    return book.author === successMessage;
  });
  console.log(booksByAuthor)
})

let myPromise4 = new Promise((resolve,reject) => {
  setTimeout(() => {
    //passing title as parameter
    resolve("The Divine Comedy")
  },6000)})

myPromise4.then((successMessage) => {
  const booksBytitle = Object.values(books).filter((book) => {
    return book.title === successMessage;
  });
  console.log(booksBytitle)
})

module.exports.general = public_users;
