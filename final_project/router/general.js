const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    if (req.body.username && req.body.password) {
        let newUser = {
            "username": req.body.username,
            "password": req.body.password
        }
        users.push(newUser)
    }
    res.send("The user" + (' ') + (req.body.username) + " Has been added!");
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let myPromise1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(res.send(JSON.stringify(books, null, 4)))
        }, 3000)
    })

    myPromise1.then()

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let myPromise1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            const isbn = req.params.isbn
            resolve(res.send((JSON.stringify(books[isbn], null, 4))))
        }, 3000)
    })

    myPromise1.then()

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
    let size = Object.keys(books).length
    for (let i = 1; i <= size; i++) {
        if (books[i].author == author) {
            res.send(books[i])
        }
    }
    
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;
    let size = Object.keys(books).length
    for (let i = 1; i <= size; i++) {
        if (books[i].title == title) {
            res.send(books[i])
        }
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn
    console.log(books[isbn])
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;


