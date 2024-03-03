
const express = require('express');
const public = express.Router();

let books = require("./booksdb.js").books;
let search = require("./booksdb.js").search;

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;



public.post("/register", (req, res) => {
    const db = isValid(req.body.username);
    let note = 'is not valid (2 to 8 characters, lowercase or numbers)'
      , code = 401
      ;
    if (db === 0) note = 'is unavailable';
    else if (db === 1) {
        code = 200;
        users.push({
            username: req.body.username,
            password: req.body.password
        });
        note = 'successfully registered, you can login'
    }
    return res.status(code).json({ message: `${req.body.username} ${note}` })
});



public.get('/', function (req, res) {
    return res.status(200).json(books)
});


public.get('/isbn/:isbn', function (req, res) {
    const id = req.params.isbn;
    if (books.hasOwnProperty(id)) {
        return res.status(200).json(books[id])
    }
    return res.status(404).json({ message: "Not Found" })
});


public.get('/author/:author', function (req, res) {
    const result = search(books, "author", req.params.author)
    if (result) {
        return res.status(200).json(result)
    }
    return res.status(404).json({ message: "Not Found" })
});


public.get('/title/:title', function (req, res) {
    const result = search(books, "title", req.params.title)
    if (result) {
        return res.status(200).json(result)
    }
    return res.status(404).json({ message: "Not Found" })
});


public.get('/review/:isbn', function (req, res) {
    const id = req.params.isbn;
    if (books.hasOwnProperty(id)) {
        return res.status(200).json(books[id].reviews)
    }
    return res.status(404).json({ message: "Not Found" })
});



module.exports.general = public;
