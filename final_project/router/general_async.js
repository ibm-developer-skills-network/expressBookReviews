// with async/await
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get('/', async function (req, res) {
    try {
        const fetchBooks = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(books);
                }, 1000);
            });
        };

        const fetchedBooks = await fetchBooks();

        res.json(fetchedBooks);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching books." });
    }
});


// Get book details by ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = await getBookByISBN(isbn);

        if (!book) {
            res.status(404).json({ message: "Book not found." });
        } else {
            res.json(book);
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching book details." });
    }
});

// Get book details by author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const book = await getBookByAuthor(author);

        if (!book) {
            res.status(404).json({ message: "No books found for the author." });
        } else {
            res.json(book);
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching book details." });
    }
});

// Get book details by title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const book = await getBookByTitle(title);

        if (!book) {
            res.status(404).json({ message: "No books found with the title." });
        } else {
            res.json(book);
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching book details." });
    }
});

// Simulated asynchronous function to fetch a book by ISBN
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books[isbn]);
        }, 1000); // Simulating a 1-second delay
    });
}

// Simulated asynchronous function to fetch a book by author
function getBookByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const matchingBooks = Object.values(books).filter(book => book.author === author);
            resolve(matchingBooks.length > 0 ? matchingBooks[0] : null);
        }, 1000); // Simulating a 1-second delay
    });
}

// Simulated asynchronous function to fetch a book by title
function getBookByTitle(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const matchingBooks = Object.values(books).filter(book => book.title === title);
            resolve(matchingBooks.length > 0 ? matchingBooks[0] : null);
        }, 1000); // Simulating a 1-second delay
    });
}




