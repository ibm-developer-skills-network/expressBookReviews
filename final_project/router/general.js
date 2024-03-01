
const express = require('express');
const public = express.Router();

let books = require("./booksdb.js").books;
let search = require("./booksdb.js").search;

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;



public.post("/register", (req, res) => {
    
    // Write your code here
    
    return res.status(300).json({ message: "Yet to be implemented" })
});



public.get('/', function (req, res) {
    return res.status(200).json(books)
});

public.get('/isbn/:isbn', function (req, res) {
    const id = req.params.isbn;
    if (books.hasOwnProperty(id)) {
        return res.status(200).json(books[id])
    } else return res.status(404).json({ message: "Not Found" })
});

public.get('/author/:author', function (req, res) {
    let result = search(books, "author", req.params.author)
    if (result) {
        return res.status(200).json(result)
    }
    return res.status(404).json({ message: "Not Found" })
});

public.get('/title/:title', function (req, res) {
    let result = search(books, "title", req.params.title)
    if (result) {
        return res.status(200).json(result)
    }
    return res.status(404).json({ message: "Not Found" })
});



public.get('/review/:isbn', function (req, res) { // Get book review
    
    // Write your code here
    
    return res.status(300).json({ message: "Yet to be implemented" })
});



module.exports.general = public;
