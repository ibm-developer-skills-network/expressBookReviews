const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Find the user with the specified username and password.
    const user = users.find(user => user.username === username && user.password === password);
    // If no user is found, return an error response.
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // If a user is found, create a JWT token with the user's information.
    const token = jwt.sign({ username: user.username, password: user.password }, 'access');
    req.session.authorization = { accessToken: token };

    // Return the token in the response.
    return res.status(200).json({ token: token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;

    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    // Find the book with the specified ISBN.
    const book = books[isbn];

    // If no book is found, return an error response.
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add or update the user's review for the book.
    book.reviews[username] = review;

    // Return the updated book information.
    return res.status(200).json({ book: book });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    // Find the book with the specified ISBN.
    const book = books[isbn];

    // If no book is found, return an error response.
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!book.reviews[username]) return res.status(403).json({ 'error': 'no review for this user' })

    delete book.reviews[username];
    return res.status(200).json({
        message: "Review deleted successfully",
        book: book
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
