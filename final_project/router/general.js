
const express = require('express');
const public = express.Router();

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;



public.post("/register", (req, res) => {
    
    // Write your code here
    
    return res.status(300).json({ message: "Yet to be implemented" })
});



public.get('/', function (req, res) {
    return res.status(200).json(books)
});



public.get('/isbn/:isbn', function (req, res) { // Get book details based on ISBN
    
    // Write your code here
    
    return res.status(300).json({ message: "Yet to be implemented" })
});



public.get('/author/:author', function (req, res) { // Get book details based on author
    
    // Write your code here
    
    return res.status(300).json({ message: "Yet to be implemented" })
});



public.get('/title/:title', function (req, res) { // Get all books based on title
    
    // Write your code here
    
    return res.status(300).json({ message: "Yet to be implemented" })
});



public.get('/review/:isbn', function (req, res) { // Get book review
    
    // Write your code here
    
    return res.status(300).json({ message: "Yet to be implemented" })
});



module.exports.general = public;
