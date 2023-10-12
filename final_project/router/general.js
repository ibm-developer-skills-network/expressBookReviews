const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'username and password required' });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: 'username already exists' });
    }

    users.push({ username, password });
    return res.status(201).json({ message: 'user registered successfully' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let getBooks = new Promise((resolve, reject) => {
        resolve(books)
    })

    getBooks.then((successMessage) => {
        return res.status(200).json(successMessage);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let getFilteredBookByISBN = new Promise((resolve, reject) => {
        const isbn = req.params.isbn
        const filteredBookByISBN = books[isbn]

        !!filteredBookByISBN ? resolve(filteredBookByISBN) : reject()
    })

    getFilteredBookByISBN.then((successMessage) => {
        return res.status(200).json(successMessage);
    }).catch(() => {
        return res.status(404).json({ message: "Not found" });
    })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let getFilteredBookByAuthor = new Promise((resolve, reject) => {
        const filteredBooksByAuthor = []

        const author = req.params.author

        for (const [key, value] of Object.entries(books)) {
            if (value.author === author) filteredBooksByAuthor.push({ key: value })
        }

        !!filteredBooksByAuthor.length ? resolve(filteredBooksByAuthor) : reject()
    })

    getFilteredBookByAuthor.then((successMessage) => {
        return res.status(200).json(successMessage);
    }).catch(() => {
        return res.status(404).json({ message: "Not found" });
    })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let getFilteredBookByTitle = new Promise((resolve, reject) => {
        const filteredBooksByTitle = []

        const title = req.params.title

        for (const [key, value] of Object.entries(books)) {
            if (value.title.toLowerCase().includes(title)) filteredBooksByTitle.push({ key: value })
        }

        !!filteredBooksByTitle.length ? resolve(filteredBooksByTitle) : reject()
    })

    getFilteredBookByTitle.then((successMessage) => {
        return res.status(200).json(successMessage);
    }).catch(() => {
        return res.status(404).json({ message: "Not found" });
    })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const filteredBookByISBN = books[req.params.isbn]
    return filteredBookByISBN ? res.status(200).json(filteredBookByISBN.reviews) : res.status(404).json({ message: "Not found" });
});

module.exports.general = public_users;
