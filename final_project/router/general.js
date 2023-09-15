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
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,11));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorParam = req.params.author;
    const bookDetails = [];

    // Obtain all the keys for the 'books' object
    const bookKeys = Object.keys(books);
  
    // Iterate through the 'books' array & check the author matches the one provided in the request parameters
    for (const key of bookKeys) {
      if (books[key].author === authorParam) {
        bookDetails.push(books[key]);
      }
    }
  
    if (bookDetails.length === 0) {
      res.status(404).json({ message: 'Author not found' });
    } else {
      res.status(200).json(bookDetails);
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleParam = req.params.title;
    const bookDetails = [];

    // Obtain all the keys for the 'books' object
    const bookKeys = Object.keys(books);
  
    // Iterate through the 'books' array & check the author matches the one provided in the request parameters
    for (const key of bookKeys) {
      if (books[key].title === titleParam) {
        bookDetails.push(books[key]);
      }
    }
  
    if (bookDetails.length === 0) {
      res.status(404).json({ message: 'Title not found' });
    } else {
      res.status(200).json(bookDetails);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnParam = req.params.isbn;

    // Get the book reviews based on ISBN provided in the request parameters
    const reviews = books[isbnParam];
  
    if (!reviews) {
      res.status(404).json({ message: 'No reviews found for the ISBN provided' });
    } else {
      res.status(200).json(reviews);
    }
});

module.exports.general = public_users;
