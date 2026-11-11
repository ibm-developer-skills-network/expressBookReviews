const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user. Username and password are required." });
});

// Task 1 & Task 10: Get the book list available in the shop using Promises / async callback
function getBookList() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

public_users.get('/', function (req, res) {
    getBookList()
        .then((bookList) => res.status(200).send(JSON.stringify(bookList, null, 4)))
        .catch((error) => res.status(500).json({ message: "Error fetching book list", error: error.message }));
});

// Task 2 & Task 11: Get book details based on ISBN using Promises
function getFromISBN(isbn) {
    return new Promise((resolve, reject) => {
        let book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject({ status: 404, message: "Book not found" });
        }
    });
}

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getFromISBN(isbn)
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});
  
// Task 3 & Task 12: Get book details based on author using Promises
function getFromAuthor(author) {
    return new Promise((resolve, reject) => {
        let matchingBooks = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
                matchingBooks.push(books[isbn]);
            }
        });
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: "No books found for this author" });
        }
    });
}

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    getFromAuthor(author)
        .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
        .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 4 & Task 13: Get all books based on title using Promises
function getFromTitle(title) {
    return new Promise((resolve, reject) => {
        let matchingBooks = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks.push(books[isbn]);
            }
        });
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: "No books found with this title" });
        }
    });
}

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    getFromTitle(title)
        .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
        .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    }
    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
