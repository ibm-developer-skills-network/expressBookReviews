const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!(username && password)) return res.status(404).json({message: "Unable to register user"});
    if(isValid(username)) return res.status(404).json({message: "User is already registered!"});
    
    users.push({"username":username,"password":password})
    return res.status(200).json({message:"User successfully registered!"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 0));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn], null, 0))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    return res.send(Object.values(books).filter(book => book["author"] === author));
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    return res.send(Object.values(books).filter(book => book["title"] === title))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn]["reviews"], null, 0))
});

module.exports.general = public_users;
