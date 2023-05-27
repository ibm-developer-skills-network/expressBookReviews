const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.json({ error: "please provide username and password" });

    let userNameExists = users.find(user => user.username == username);
    if (userNameExists) return res.json({ error: 'username already exists' });

    let newUser = {
        username: username,
        password: password
    };
    users.push(newUser);
    return res.status(300).json(newUser);
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const promise = new Promise((resolve, reject) => {
        const booksData = books;
        if (!booksData) reject({ 'error': 'books not found' });
        resolve(booksData);
    });

    return promise
        .then((booksData) => {
            // Return a success response with the books data.
            return res.status(200).json(booksData);
        })
        .catch((error) => {
            // Return an error response.
            return res.status(500).json({ message: "Internal server error" });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    const promise = new Promise((resolve, reject) => {
        let book = books[isbn];
        if (!book) {
            reject({ 'error': 'book not found' });
        } else {
            resolve(book);
        }
    });


    return promise
        .then((bookData) => {
            // Return a success response with the book data.
            return res.status(200).json(bookData);
        })
        .catch((error) => {
            // Return an error response.
            return res.status(404).json(error);
        });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const promise = new Promise((resolve, reject) => {
        let bookByAuthor = null;

        for (const id in books) {
            if (books[id].author === author) {
                bookByAuthor = { id, ...books[id] };
                break;
            }
        }

        if (!bookByAuthor) {
            // If no books are found by the author, reject the Promise with an error message.
            reject({ message: `No books found by author ${author}` });
        } else {
            // If a book is found by the author, resolve the Promise with the book data.
            resolve({ book: bookByAuthor });
        }
    });

    return promise
        .then((bookData) => {
            // Return a success response with the book data.
            return res.status(200).json(bookData);
        })
        .catch((error) => {
            // Return an error response.
            return res.status(404).json(error);
        });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const promise = new Promise((resolve, reject) => {
        let bookByTitle = null;

        for (const id in books) {
            if (books[id].title === title) {
                bookByTitle = { id, ...books[id] };
                break;
            }
        }

        if (!bookByTitle) {
            reject({ message: `No books found by title ${title}` });
        } else {
            resolve({ book: bookByTitle });
        }
    });

    return promise
        .then((bookData) => {
            return res.status(200).json(bookData);
        })
        .catch((error) => {
            return res.status(404).json(error);
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    let book = books[isbn];
    if (!book) return res.json({ 'error': 'book not found' });

    let reviews = book.reviews;

    return res.status(300).json(reviews);
});

module.exports.general = public_users;
