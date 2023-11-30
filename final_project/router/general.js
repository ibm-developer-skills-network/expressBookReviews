//This contains the skeletal implementations for the routes which a general user can access.


const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});


// Get the book list available in the shop
  public_users.get('/',function (req, res) {

  //Write your code here
  res.send(JSON.stringify({books},null,4));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  
  const isbn = req.params.isbn;
  const book = books[isbn];

  // Check if the book with the given ISBN is found
  if (book) {
      // If found, send the book details as JSON response
      res.status(200).json(book);
  } else {
      // If not found, send a 404 response with an error message
      res.status(404).json({ message: "Book not found with the provided ISBN" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
