const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userWithSameName = users.filter((user => {
    return user.username === username
  }))

  if (userWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)){
      users.push({"username":username,"password":password})
      return res.status(200).json({message: "User " + username + " successfully register, now you can login"})
    }else {
      return res.status(404).json({message: "User " + username + " already exists"});
    }
  }
  return res.status(404).json({message: "Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  const book = books[isbn];
  res.send(JSON.stringify(book, null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const author = req.params.author;
  const retVal = {};
  for (let key of Object.keys(books)) {
    const book = books[key];
    if (book['author'] === author) {
      retVal[key] = book;
    }
  }
  res.send(JSON.stringify(retVal, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const title = req.params.title;
  console.log('title,', title);
  const retVal = {};
  for (let key of Object.keys(books)) {
    const book = books[key];
    if (book['title'] === title) {
      retVal[key] = book;
    }
  }
  res.send(JSON.stringify(retVal, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  const book = books[isbn];
  res.send(book ? book.reviews : '');
});

module.exports.general = public_users;


