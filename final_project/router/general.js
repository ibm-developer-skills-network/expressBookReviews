const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
// const axios = require("axios").default;

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
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
  res.send(JSON.stringify({books}, null, 10));
  return res.status(200).json({message: "Successful"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let filtered_users = users.filter((user) => user.isbn === isbn);
    res.send(filtered_users);
    return res.status(200).json({message: "Successful"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_users = users.filter((user)=> user.author === author);
  res.send(filtered_users);
  return res.status(300).json({message: "Successful"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered_users = users.filter((user)=> user.title === title);
    res.send(filtered_users);
  return res.status(300).json({message: "Successful"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const review = req.params.review;
    let filtered_users = users.filter((user)=> user.review === review);
    res.send(filtered_users);
  return res.status(200).json({message: "Successful"});
});

module.exports.general = public_users;
