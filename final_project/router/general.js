const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.status(422).json({ message: 'Invalid register details!' });
    } else {
        if (doesExisted(username, password)) {
            res.status(404).json({
                message: `User ${username} already existed!`,
            });
        } else {
            users.push({ username, password });
            res.send('User successfully registred. Now you can login');
        }
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const booksJSON = JSON.stringify(books, null, 4);
    return res.send(booksJSON);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)) {
        return res.send(books[isbn]);
    } else {
        return res
            .status(404)
            .json({ message: `No book with ISBN ${isbn} are found!` });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksKey = Object.keys(books);
    const isbnToFind = booksKey.filter((isbn) => {
        return books[isbn].author === author;
    });
    if (isbnToFind.length > 0) {
        return res.send(books[isbnToFind[0]]);
    } else {
        return res
            .status(404)
            .json({ message: `No book written by ${author} are found!` });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksKey = Object.keys(books);
    const isbnToFind = booksKey.filter((isbn) => {
        return books[isbn].title === title;
    });
    if (isbnToFind.length > 0) {
        return res.send(books[isbnToFind[0]]);
    } else {
        return res
            .status(404)
            .json({ message: `No book with title ${title} are found!` });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)) {
        return res.send(books[isbn].reviews);
    } else {
        return res
            .status(404)
            .json({ message: `No book with ISBN ${isbn} are found!` });
    }
});

function doesExisted(username, password) {
    let userFiltered = users.filter((user) => user.username === username);
    if (userFiltered.length > 0) {
        return true;
    } else {
        return false;
    }
}

module.exports.general = public_users;
