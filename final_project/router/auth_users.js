const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const { username } = req.user; // Retrieve username from the session

    // Find the book by ISBN
    const bookIndex = books.findIndex(book => book.isbn === isbn);

    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already reviewed this book
    const existingReviewIndex = books[bookIndex].reviews.findIndex(item => item.username === username);

    if (existingReviewIndex !== -1) {
        // Modify existing review
        books[bookIndex].reviews[existingReviewIndex].review = review;
        res.json({ message: "Review modified successfully" });
    } else {
        // Add new review
        books[bookIndex].reviews.push({ username, review });
        res.json({ message: "Review added successfully" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username } = req.user; // Retrieve username from the session

    // Find the book by ISBN
    const bookIndex = books.findIndex(book => book.isbn === isbn);

    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Find the review by the user
    const reviewIndex = books[bookIndex].reviews.findIndex(item => item.username === username);

    if (reviewIndex === -1) {
        return res.status(404).json({ message: "Review not found" });
    }

    // Delete the review
    books[bookIndex].reviews.splice(reviewIndex, 1);
    res.json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
