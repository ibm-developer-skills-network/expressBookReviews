const express = require('express');
let books = require("./booksdb.js");
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
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
});

// Get the book list available in the shop
public_users.get('/',async function(req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function(req, res) {
  //Write your code here
  const isbn = req.params['isbn'];
  const book = books[isbn];
  if (book!=undefined) {
    return res.status(200).json(book);
  }
  else {
    return res.status(404).json({message: "isbn not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const authorParam = req.params['author'];
  let result = {};
  for (let key in books) {
    let book = books[key];
    let authorMatched = book['author'] == authorParam;
    if (authorMatched) {
      result[key] = books[key];
    }
  }
  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const titleParam = req.params['title'];
  let result = {};
  for (let key in books) {
    let book = books[key];
    let titleMatched = book['title'] == titleParam;
    if (titleMatched) {
      result[key] = books[key];
    }
  }
  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params['isbn'];
  const book = books[isbn];
  if (book!=undefined) {
    return res.status(200).json(book['reviews']);
  }
  else {
    return res.status(404).json({message: "isbn not found"});
  }
 });
module.exports.general = public_users;
